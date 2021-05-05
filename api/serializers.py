from django.contrib.auth import authenticate
from django.db.transaction import atomic
from rest_framework import serializers
from rest_framework_simplejwt.serializers import PasswordField

from api.main_models.annex import TradeAgreementAnnex
from api.main_models.contract import BaseContract, TradeAgreement, Contact, AgreementEntity, Bank, BankAccount, \
    ServiceAgreement, DistributionAgreement, AgentAgreement, POAgreement, RentAgreement, OneTimeAgreement, \
    InternationalAgreement
from api.models import Person, CustomUser


class ContractListSerializer(serializers.ModelSerializer):

    entity_name = serializers.CharField(source='entity.name', required=False)
    sales_manager = serializers.CharField(source='sales_manager.fullname', required=False)
    executive = serializers.CharField(source='executive.fullname', required=False)
    type = serializers.SerializerMethodField()

    class Meta:

        model = BaseContract

        fields = ['entity_name', 'contract_no', 'type', 'created', 'due_date', 'sales_manager', 'executive']

    def get_type(self, obj):

        return obj.get_type_display()


class EntitySerializer(serializers.ModelSerializer):

    class Meta:
        model = AgreementEntity
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


class AnnexSerializer(serializers.ModelSerializer):

    class Meta:

        model = TradeAgreementAnnex
        fields = ['__all__']


class TradeCreateSerializer(serializers.ModelSerializer):

    entity = EntitySerializer(required=False)
    executive = PersonSerializer(required=False)
    bank = BankSerializer(required=False)
    contact = ContactSerializer(required=False)
    responsible_person = PersonSerializer(required=False)
    bank_account = BankAccountSerializer(required=False)
    # annex = AnnexSerializer(required=False)
    contract_no = serializers.CharField(required=False)

    class Meta:

        model = TradeAgreement

        fields = [
            'contract_no', 'sales_manager', 'created', 'due_date', 'entity', 'executive',
            'bank', 'bank_account',  'contact', 'responsible_person',
        ]

    @atomic
    def create(self, validated_data):

        user = self.context.get('user')

        contact_data = validated_data.pop('contact', None)
        responsible_person_data = validated_data.pop('responsible_person', None)
        entity_data = validated_data.pop('entity', None)
        executive_data = validated_data.pop('executive', None)
        bank_data = validated_data.pop('bank', None)
        bank_account_data = validated_data.pop('bank_account', None)
        annex_data = validated_data.pop('annex', None)

        contact = Contact.objects.create(**contact_data) if contact_data else None

        responsible_person = Person.objects.create(
            type=Person.TYPE.CONTACT, **responsible_person_data, contact=contact) if responsible_person_data else None

        executive = Person.objects.create(type=Person.TYPE.BUYER, **executive_data) if executive_data else None

        entity = AgreementEntity.objects.create(**entity_data) if entity_data else None

        bank = Bank.objects.create(**bank_data) if bank_account_data else None

        BankAccount.objects.create(owner=entity, bank=bank, **bank_account_data) if bank_account_data else None

        contract = TradeAgreement.objects.create(plant_name=user.plant_name, entity=entity,
                                                 responsible_person=responsible_person,
                                                 executive=executive, **validated_data)

        return contract


#
# class ServiceCreateSerializer(TradeCreateSerializer): # Trade
#
#     class Meta:
#
#         model = ServiceAgreement
#
#
# class DistributionCreateSerializer(TradeCreateSerializer): # Trade
#
#     class Meta:
#         model = DistributionAgreement
#
#
# class AgentCreateSerializer(serializers.ModelSerializer):
#
#     class Meta:
#         model = AgentAgreement
#
#
# class POCreateSerializer(serializers.ModelSerializer):
#
#     class Meta:
#         model = POAgreement
#
#
# class RentCreateSerializer(serializers.ModelSerializer):
#
#     class Meta:
#         model = RentAgreement
#
#
# class OneTimeCreateSerializer(serializers.ModelSerializer):
#
#     class Meta:
#         model = OneTimeAgreement
#
#
# class InternationalCreateSerializer(serializers.ModelSerializer):
#
#     class Meta:
#         model = InternationalAgreement
#
#


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
