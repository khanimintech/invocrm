from copy import copy

from django.contrib.auth import authenticate
from django.db.transaction import atomic
from rest_framework import serializers

from api.main_models.annex import TradeAgreementAnnex, BaseAnnex
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

annex_map = {
    BaseAnnex: 'Trade'
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

    company = EntitySerializer(required=False)
    executor = PersonSerializer(required=False)
    bank = BankSerializer(required=False)
    contact = ContactSerializer(required=False)
    responsible_person = PersonSerializer(required=False)
    bank_account = BankAccountSerializer(required=False)
    contract_no = serializers.CharField()

    @atomic
    def create(self, validated_data):

        def create_pop_or_none(cls, field_name, **kwargs):
            return cls.objects.create(**kwargs, **validated_data.pop(field_name)) if validated_data.get(field_name,
                                                                                                        None) else None
        user = self.context.get('user')

        annex_data = validated_data.pop('annex', None)

        contact = create_pop_or_none(Contact, 'contact')

        responsible_person = create_pop_or_none(Person, 'responsible_person', **{'type': Person.TYPE.CONTACT, 'contact': contact})

        executor = create_pop_or_none(Person, 'executor', **{'type': Person.TYPE.BUYER})

        company = create_pop_or_none(Company, 'company')

        bank = create_pop_or_none(Bank, 'bank')

        create_pop_or_none(BankAccount, 'bank_account', **{'company_owner': company, 'personal_owner': executor, 'bank': bank})

        contract = contract_map[validated_data['type']].objects.create(plant_name=user.plant_name, company=company,
                                                                       responsible_person=responsible_person,
                                                                       executor=executor, **validated_data)

        if contract.type == BaseContract.Type.ONE_TIME and annex_data:

            BaseAnnex.objects.create(contract=contract, **annex_data)

        return contract


class TradeCreateSerializer(ContractCreateBaseSerializer):

    class Meta:

        model = TradeAgreement

        fields = [
            'contract_no', 'sales_manager', 'created', 'due_date', 'company', 'executor',
            'bank', 'bank_account',  'contact', 'responsible_person', 'type'
        ]


class ServiceCreateSerializer(ContractCreateBaseSerializer):

    class Meta:

        model = ServiceAgreement
        fields = [
            'contract_no', 'sales_manager', 'created', 'due_date', 'company', 'executor',
            'bank', 'bank_account', 'contact', 'responsible_person', 'type'

        ]


class DistributionCreateSerializer(ContractCreateBaseSerializer):

    class Meta:
        model = DistributionAgreement

        fields = [
            'contract_no', 'sales_manager', 'created', 'due_date', 'company', 'executor',
            'bank', 'bank_account', 'contact', 'responsible_person', 'type', 'territory',
            'subject_of_distribution'

        ]


class AgentCreateSerializer(ContractCreateBaseSerializer):

    class Meta:
        model = AgentAgreement

        fields = [
            'contract_no', 'sales_manager', 'created', 'due_date', 'company', 'executor',
            'bank', 'bank_account', 'contact', 'responsible_person', 'type', 'territory',
        ]


class RentCreateSerializer(ContractCreateBaseSerializer):

    class Meta:

        model = RentAgreement
        fields = [
            'contract_no', 'sales_manager', 'created', 'due_date', 'company', 'executor',
            'bank', 'bank_account', 'contact', 'responsible_person', 'type'
        ]


class OneTimeAnnexSerializer(serializers.ModelSerializer):
    pass


class OneTimeCreateSerializer(ContractCreateBaseSerializer):

    executor_contact = ContactSerializer()
    annex = OneTimeAnnexSerializer()

    class Meta:
        model = OneTimeAgreement

        fields = [
            'sales_manager', 'created', 'due_date', 'company', 'executor',
            'executor_contact', 'type', 'subtype', 'final_amount_with_writing',
            'price_offer', 'price_offer_validity', 'warranty_period', 'unpaid_period',
            'unpaid_value', 'part_payment', 'part_acquisition', 'standard', 'annex'
        ]


class InternationalCreateSerializer(ContractCreateBaseSerializer):

    class Meta:

        model = InternationalAgreement
        fields = [
            'contract_no', 'sales_manager', 'created', 'due_date', 'company', 'executor',
            'bank', 'bank_account', 'contact', 'responsible_person', 'type', 'country',
            'payment_condition'
        ]


class CustomerCreateSerializer(ContractCreateBaseSerializer):

    class Meta:
        model = CustomerTemplateAgreement
        fields = [
            'contract_no', 'sales_manager', 'created', 'due_date', 'company', 'executor',
            'bank', 'bank_account', 'contact', 'responsible_person', 'type', 'custom_contract_type'
        ]


class POCreateSerializer(ContractCreateBaseSerializer):

    class Meta:
        model = POAgreement

        fields = [
            'po_number', 'sales_manager', 'created', 'due_date', 'company', 'type'
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
