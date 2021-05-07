from django.contrib.auth import authenticate
from django.db.transaction import atomic
from rest_framework import serializers

from api.main_models.annex import TradeAgreementAnnex
from api.main_models.contract import BaseContract, TradeAgreement, Contact, Company, Bank, BankAccount, \
    ServiceAgreement, DistributionAgreement, AgentAgreement, POAgreement, RentAgreement, OneTimeAgreement, \
    InternationalAgreement, CustomerTemplateAgreement
from api.models import Person, CustomUser

contract_map = {
            BaseContract.Type.TRADE: TradeAgreement,
            BaseContract.Type.SERVICE: ServiceAgreement,
            BaseContract.Type.DISTRIBUTION: DistributionAgreement,
            BaseContract.Type.AGENT: AgentAgreement,
            BaseContract.Type.PO: POAgreement,
            BaseContract.Type.RENT: RentAgreement,
            BaseContract.Type.ONE_TIME: OneTimeAgreement,
            BaseContract.Type.INTERNATIONAL: InternationalAgreement
        }


class ContractListSerializer(serializers.ModelSerializer):

    company_name = serializers.SerializerMethodField()
    sales_manager = serializers.CharField(source='sales_manager.fullname')
    type = serializers.SerializerMethodField()
    annex_count = serializers.SerializerMethodField()
    status = serializers.SerializerMethodField()

    class Meta:

        model = BaseContract

        fields = ['company_name', 'contract_no', 'type', 'created', 'due_date', 'sales_manager', 'annex_count', 'status']

    def get_type(self, obj):

        return obj.get_type_display()

    def get_company_name(self, obj):

        if obj._is_individual_contract:

            return None
        else:
            return obj.company.name

    def get_annex_count(self, obj):

        return 0

    def get_status(self, obj):

        return obj.get_status_display()


class EntitySerializer(serializers.ModelSerializer):

    class Meta:
        model = Company
        fields = '__all__'


class BankSerializer(serializers.ModelSerializer):

    class Meta:

        model = Bank
        fields = '__all__'


class PersonSerializer(serializers.ModelSerializer):

    class Meta:

        model = Person
        fields = ['first_name', 'last_name', 'fathers_name',]


class ContactSerializer(serializers.ModelSerializer):

    class Meta:

        model = Contact
        fields = '__all__'


class BankAccountSerializer(serializers.ModelSerializer):

    class Meta:

        model = BankAccount
        fields = ['default', 'account', 'swift_no', 'correspondent_account']


class ContractCreateBaseSerializer(serializers.ModelSerializer):

    entity = EntitySerializer(required=False)
    executive = PersonSerializer(required=False)
    bank = BankSerializer(required=False)
    contact = ContactSerializer(required=False)
    responsible_person = PersonSerializer(required=False)
    bank_account = BankAccountSerializer(required=False)
    contract_no = serializers.CharField(required=False)

    @atomic
    def create(self, validated_data):
        user = self.context.get('user')

        contact_data = validated_data.pop('contact', None)
        responsible_person_data = validated_data.pop('responsible_person', None)
        entity_data = validated_data.pop('entity', None)
        executive_data = validated_data.pop('executive', None)
        bank_data = validated_data.pop('bank', None)
        bank_account_data = validated_data.pop('bank_account', None)

        contact = Contact.objects.create(**contact_data) if contact_data else None

        responsible_person = Person.objects.create(
            type=Person.TYPE.CONTACT, **responsible_person_data, contact=contact) if responsible_person_data else None

        executive = Person.objects.create(type=Person.TYPE.BUYER, **executive_data) if executive_data else None

        entity = Company.objects.create(executive=executive, **entity_data) if entity_data else None

        bank = Bank.objects.create(**bank_data) if bank_account_data else None

        BankAccount.objects.create(owner=entity, bank=bank, **bank_account_data) if bank_account_data else None

        contract = contract_map[validated_data['type']].objects.create(plant_name=user.plant_name, entity=entity,
                                                                       responsible_person=responsible_person,
                                                                       **validated_data)
        return contract


class TradeCreateSerializer(ContractCreateBaseSerializer):

    class Meta:

        model = TradeAgreement

        fields = [
            'contract_no', 'sales_manager', 'created', 'due_date', 'entity', 'executive',
            'bank', 'bank_account',  'contact', 'responsible_person', 'type'
        ]


class ServiceCreateSerializer(ContractCreateBaseSerializer):

    class Meta:

        model = ServiceAgreement
        fields = [
            'contract_no', 'sales_manager', 'created', 'due_date', 'entity', 'executive',
            'bank', 'bank_account', 'contact', 'responsible_person', 'type'

        ]


class DistributionCreateSerializer(ContractCreateBaseSerializer):

    class Meta:
        model = DistributionAgreement

        fields = [
            'contract_no', 'sales_manager', 'created', 'due_date', 'entity', 'executive',
            'bank', 'bank_account', 'contact', 'responsible_person', 'type', 'territory',
            'subject_of_distribution'

        ]


class AgentCreateSerializer(serializers.ModelSerializer):

    class Meta:
        model = AgentAgreement

        fields = [
            'contract_no', 'sales_manager', 'created', 'due_date', 'entity', 'executive',
            'bank', 'bank_account', 'contact', 'responsible_person', 'type', 'territory',
        ]


class POCreateSerializer(serializers.ModelSerializer):

    entity = EntitySerializer()

    class Meta:
        model = POAgreement

        fields = [
            'po_number', 'sales_manager', 'created', 'due_date', 'entity', 'type'
        ]

    @atomic
    def create(self, validated_data):

        user = self.context.get('user')
        entity_data = validated_data.pop('entity', None)

        entity = Company.objects.create(**entity_data) if entity_data else None

        contract = contract_map[validated_data['type']].objects.create(plant_name=user.plant_name, entity=entity,
                                                                       **validated_data)
        return contract


class RentCreateSerializer(ContractCreateBaseSerializer):

    class Meta:

        model = RentAgreement
        fields = [
            'contract_no', 'sales_manager', 'created', 'due_date', 'entity', 'executive',
            'bank', 'bank_account', 'contact', 'responsible_person', 'type'
        ]


class OneTimeCreateSerializer(serializers.ModelSerializer):

    entity = EntitySerializer()
    executive = PersonSerializer()
    executive_contact = ContactSerializer()
    # annex = AnnexSerializer()

    class Meta:
        model = OneTimeAgreement

        fields = [
            'sales_manager', 'created', 'due_date', 'entity', 'executive',
            'executive_contact', 'type', 'subtype', 'final_amount_with_writing',
            'price_offer', 'price_offer_validity', 'warranty_period', 'unpaid_period',
            'unpaid_value', 'part_payment', 'part_acquisition', 'standard',
            # 'annex',
        ]

    @atomic
    def create(self, validated_data):
        user = self.context.get('user')

        executive_contact_data = validated_data.pop('executive_contact', {})
        entity_data = validated_data.pop('entity', {})
        executive_data = validated_data.pop('executive', {})

        contact = Contact.objects.create(**executive_contact_data) if executive_contact_data else None

        executive = Person.objects.create(type=Person.TYPE.BUYER, contact=contact,
                                          **executive_data) if executive_data else None

        entity = Company.objects.create(executive=executive, **entity_data) if entity_data else None

        contract = contract_map[validated_data['type']].objects.create(plant_name=user.plant_name, entity=entity,
                                                                       **validated_data)
        return contract


class InternationalCreateSerializer(ContractCreateBaseSerializer):

    class Meta:

        model = InternationalAgreement
        fields = [
            'contract_no', 'sales_manager', 'created', 'due_date', 'entity', 'executive',
            'bank', 'bank_account', 'contact', 'responsible_person', 'type', 'country',
            'payment_condition'
        ]


class CustomerCreateSerializer(ContractCreateBaseSerializer):

    class Meta:
        model = CustomerTemplateAgreement
        fields = [
            'contract_no', 'sales_manager', 'created', 'due_date', 'entity', 'executive',
            'bank', 'bank_account', 'contact', 'responsible_person', 'type', 'custom_contract_type'
        ]


class LoginSerializer(serializers.Serializer):

    email = serializers.EmailField(required=True)
    password = serializers.CharField(write_only=True, required=True)

    def validate(self, attrs):
        email = attrs.get('email')
        password = attrs.get('password')
        try:
            user = CustomUser.objects.get(email__iexact=email)

        except CustomUser.DoesNotExist:

            raise serializers.ValidationError('User with that email does not exist')

        user = authenticate(self.context['request'], username=user.username, password=password)
        if user:
            return {'user': user}
        else:
            raise serializers.ValidationError('User with that email does not exist')
