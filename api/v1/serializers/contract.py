from copy import copy
from datetime import timedelta

from django.contrib.auth import authenticate
from django.db.transaction import atomic
from django.utils import timezone
from rest_framework import serializers

from api.main_models.annex import TradeAgreementAnnex, BaseAnnex, POAgreementSupplements, ProductInvoiceItem
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
    BaseContract.Type.INTERNATIONAL: InternationalAgreement,
    BaseContract.Type.CUSTOMER: CustomerTemplateAgreement
}

annex_map = {
    BaseAnnex: 'Trade'
}


class ContractListSerializer(serializers.ModelSerializer):

    company_name = serializers.SerializerMethodField()
    sales_manager = serializers.CharField(source='sales_manager.fullname')
    annex_count = serializers.SerializerMethodField()
    status = serializers.SerializerMethodField()
    executor_name = serializers.SerializerMethodField()

    class Meta:

        model = BaseContract

        fields = ['id', 'company_name', 'contract_no', 'type', 'created', 'due_date', 'sales_manager',
                  'annex_count', 'status', 'executor_name']

    def get_executor_name(self, obj):

        if obj.executor:

            return obj.executor.fullname

        return 'N/A'

    def get_company_name(self, obj):

        if obj._is_individual_contract:

            return None

        return obj.company.name

    def get_annex_count(self, obj):

        return obj.annex_list.count()

    def get_status(self, obj):

        EXPIRED = 2
        EXPIRES = 3

        two_week_for_expire = timezone.now() + timedelta(weeks=2)

        if obj.status != EXPIRED and obj.due_date and obj.due_date < two_week_for_expire:

            return EXPIRES

        return obj.status


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
        fields = ['first_name', 'last_name', 'fathers_name', 'tin']


class ContactSerializer(serializers.ModelSerializer):

    class Meta:

        model = Contact
        fields = '__all__'


class SupplementsSerializer(serializers.ModelSerializer):

    class Meta:

        model = POAgreementSupplements
        fields = ['supplement_no', ]


class BankAccountSerializer(serializers.ModelSerializer):

    class Meta:

        model = BankAccount
        fields = ['default', 'account', 'swift_no', 'correspondent_account', 'city', 'address']


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
        products_data = validated_data.pop('products', None)
        seller_data = validated_data.pop('seller', None)

        supplements_data = validated_data.pop('supplements', None)

        contact = create_pop_or_none(Contact, 'contact')

        executor_contact = create_pop_or_none(Contact, 'executor_contact')

        responsible_person = create_pop_or_none(Person, 'responsible_person', **{'type': Person.TYPE.CONTACT, 'contact': contact})

        executor = create_pop_or_none(Person, 'executor', **{'type': Person.TYPE.BUYER, 'contact': executor_contact})

        company = create_pop_or_none(Company, 'company')

        bank = create_pop_or_none(Bank, 'bank')

        create_pop_or_none(BankAccount, 'bank_account', **{'company_owner': company, 'personal_owner': executor, 'bank': bank})

        contract = contract_map[validated_data['type']].objects.create(plant_name=user.plant_name, company=company,
                                                                       responsible_person=responsible_person,
                                                                       executor=executor, **validated_data)

        if contract.type == BaseContract.Type.ONE_TIME and annex_data:

            seller = Person.objects.create(type=Person.TYPE.SELLER, **seller_data)

            annex = BaseAnnex.objects.create(contract=contract, seller=seller, **annex_data)

            if products_data:
                for p in products_data:
                    ProductInvoiceItem.objects.create(annex=annex, **p)

        if contract.type == BaseContract.Type.PO and supplements_data:

            for s in supplements_data:

                POAgreementSupplements.objects.create(agreement=contract, **s)

        return contract


class TradeCreateSerializer(ContractCreateBaseSerializer):

    class Meta:

        model = TradeAgreement

        fields = [
            'contract_no', 'sales_manager', 'created', 'due_date', 'company', 'executor',
            'bank', 'bank_account',  'contact', 'responsible_person', 'type'
        ]


class TradeGetSerializer(serializers.ModelSerializer):

    company = EntitySerializer()
    executor = PersonSerializer()
    responsible_person = PersonSerializer()
    contract_no = serializers.CharField()
    bank = serializers.SerializerMethodField()
    contact = serializers.SerializerMethodField()
    bank_account = serializers.SerializerMethodField()

    class Meta:

        model = TradeAgreement

        fields = [
            'contract_no', 'sales_manager', 'created', 'due_date', 'company', 'executor',
            'bank', 'bank_account', 'contact', 'responsible_person', 'type', 'id'
        ]

    def get_contact(self, obj):

        if obj.responsible_person and obj.responsible_person.contact:
            return ContactSerializer(obj.responsible_person.contact).data
        return None

    def get_bank(self, obj):

        if obj.company and obj.company.bank_acc_list:

            return BankSerializer(obj.company.bank_acc_list.last().bank).data

        if obj.executor and obj.executor.b_acc_list:

            return BankSerializer(obj.executor.b_acc_list.last().bank).data

    def get_bank_account(self, obj):

        if obj.company and obj.company.bank_acc_list:

            return BankAccountSerializer(obj.company.bank_acc_list.last()).data

        if obj.executor and obj.executor.bankaccounts:

            return BankAccountSerializer(obj.executor.b_acc_list.last()).data


class ServiceCreateSerializer(ContractCreateBaseSerializer):

    class Meta:

        model = ServiceAgreement
        fields = [
            'contract_no', 'sales_manager', 'created', 'due_date', 'company', 'executor',
            'bank', 'bank_account', 'contact', 'responsible_person', 'type'

        ]


class ServiceGetSerializer(serializers.ModelSerializer):

    company = EntitySerializer()
    executor = PersonSerializer()
    responsible_person = PersonSerializer()
    contract_no = serializers.CharField()
    bank = serializers.SerializerMethodField()
    contact = serializers.SerializerMethodField()
    bank_account = serializers.SerializerMethodField()

    class Meta:

        model = ServiceAgreement

        fields = [
            'contract_no', 'sales_manager', 'created', 'due_date', 'company', 'executor',
            'bank', 'bank_account', 'contact', 'responsible_person', 'type', 'id'
        ]

    def get_contact(self, obj):

        if obj.responsible_person and obj.responsible_person.contact:
            return ContactSerializer(obj.responsible_person.contact).data
        return None

    def get_bank(self, obj):

        if obj.company and obj.company.bank_acc_list:

            return BankSerializer(obj.company.bank_acc_list.last().bank).data

        if obj.executor and obj.executor.b_acc_list:

            return BankSerializer(obj.executor.b_acc_list.last().bank).data

    def get_bank_account(self, obj):

        if obj.company and obj.company.bank_acc_list:

            return BankAccountSerializer(obj.company.bank_acc_list.last()).data

        if obj.executor and obj.executor.bankaccounts:

            return BankAccountSerializer(obj.executor.b_acc_list.last()).data


class DistributionCreateSerializer(ContractCreateBaseSerializer):

    class Meta:
        model = DistributionAgreement

        fields = [
            'contract_no', 'sales_manager', 'created', 'due_date', 'company', 'executor',
            'bank', 'bank_account', 'contact', 'responsible_person', 'type', 'territory',
            'subject_of_distribution'

        ]


class DistributionGetSerializer(serializers.ModelSerializer):

    company = EntitySerializer()
    executor = PersonSerializer()
    responsible_person = PersonSerializer()
    contract_no = serializers.CharField()
    bank = serializers.SerializerMethodField()
    contact = serializers.SerializerMethodField()
    bank_account = serializers.SerializerMethodField()

    class Meta:

        model = DistributionAgreement

        fields = [
            'contract_no', 'sales_manager', 'created', 'due_date', 'company', 'executor',
            'bank', 'bank_account', 'contact', 'responsible_person', 'type', 'id', 'territory',
            'subject_of_distribution'
        ]

    def get_contact(self, obj):

        if obj.responsible_person and obj.responsible_person.contact:
            return ContactSerializer(obj.responsible_person.contact).data
        return None

    def get_bank(self, obj):

        if obj.company and obj.company.bank_acc_list:

            return BankSerializer(obj.company.bank_acc_list.last().bank).data

        if obj.executor and obj.executor.b_acc_list:

            return BankSerializer(obj.executor.b_acc_list.last().bank).data

    def get_bank_account(self, obj):

        if obj.company and obj.company.bank_acc_list:

            return BankAccountSerializer(obj.company.bank_acc_list.last()).data

        if obj.executor and obj.executor.bankaccounts:

            return BankAccountSerializer(obj.executor.b_acc_list.last()).data


class AgentCreateSerializer(ContractCreateBaseSerializer):

    class Meta:
        model = AgentAgreement

        fields = [
            'contract_no', 'sales_manager', 'created', 'due_date', 'company', 'executor',
            'bank', 'bank_account', 'contact', 'responsible_person', 'type', 'territory',
        ]


class AgentGetSerializer(serializers.ModelSerializer):

    company = EntitySerializer()
    executor = PersonSerializer()
    responsible_person = PersonSerializer()
    contract_no = serializers.CharField()
    bank = serializers.SerializerMethodField()
    contact = serializers.SerializerMethodField()
    bank_account = serializers.SerializerMethodField()

    class Meta:

        model = AgentAgreement

        fields = [
            'contract_no', 'sales_manager', 'created', 'due_date', 'company', 'executor',
            'bank', 'bank_account', 'contact', 'responsible_person', 'type', 'id', 'territory',
        ]

    def get_contact(self, obj):

        if obj.responsible_person and obj.responsible_person.contact:
            return ContactSerializer(obj.responsible_person.contact).data
        return None

    def get_bank(self, obj):

        if obj.company and obj.company.bank_acc_list:

            return BankSerializer(obj.company.bank_acc_list.last().bank).data

        if obj.executor and obj.executor.b_acc_list:

            return BankSerializer(obj.executor.b_acc_list.last().bank).data

    def get_bank_account(self, obj):

        if obj.company and obj.company.bank_acc_list:

            return BankAccountSerializer(obj.company.bank_acc_list.last()).data

        if obj.executor and obj.executor.bankaccounts:

            return BankAccountSerializer(obj.executor.b_acc_list.last()).data


class RentCreateSerializer(ContractCreateBaseSerializer):

    class Meta:

        model = RentAgreement
        fields = [
            'contract_no', 'sales_manager', 'created', 'due_date', 'company', 'executor',
            'bank', 'bank_account', 'contact', 'responsible_person', 'type'
        ]


class RentGetSerializer(serializers.ModelSerializer):

    company = EntitySerializer()
    executor = PersonSerializer()
    responsible_person = PersonSerializer()
    contract_no = serializers.CharField()
    bank = serializers.SerializerMethodField()
    contact = serializers.SerializerMethodField()
    bank_account = serializers.SerializerMethodField()

    class Meta:

        model = RentAgreement

        fields = [
            'contract_no', 'sales_manager', 'created', 'due_date', 'company', 'executor',
            'bank', 'bank_account', 'contact', 'responsible_person', 'type', 'id'
        ]

    def get_contact(self, obj):

        if obj.responsible_person and obj.responsible_person.contact:
            return ContactSerializer(obj.responsible_person.contact).data
        return None

    def get_bank(self, obj):

        if obj.company and obj.company.bank_acc_list:

            return BankSerializer(obj.company.bank_acc_list.last().bank).data

        if obj.executor and obj.executor.b_acc_list:

            return BankSerializer(obj.executor.b_acc_list.last().bank).data

    def get_bank_account(self, obj):

        if obj.company and obj.company.bank_acc_list:

            return BankAccountSerializer(obj.company.bank_acc_list.last()).data

        if obj.executor and obj.executor.bankaccounts:

            return BankAccountSerializer(obj.executor.b_acc_list.last()).data


class OneTimeAnnexSerializer(serializers.ModelSerializer):

    class Meta:

        model = BaseAnnex

        fields = ['request_no', 'payment_terms', 'delivery_terms', 'acquisition_terms']


class OneTimeProductSerializer(serializers.ModelSerializer):

    class Meta:

        model = ProductInvoiceItem
        fields = ['name', 'unit', 'quantity', 'price', 'total']


class OneTimeCreateSerializer(ContractCreateBaseSerializer):

    executor_contact = ContactSerializer(required=False)
    annex = OneTimeAnnexSerializer(required=False)
    products = OneTimeProductSerializer(required=False, many=True)
    seller = PersonSerializer(required=False)

    class Meta:
        model = OneTimeAgreement

        fields = [
            'sales_manager', 'created', 'company', 'executor', 'executor_contact', 'type',
            'final_amount_with_writing', 'price_offer', 'price_offer_validity', 'warranty_period',
            'unpaid_period', 'unpaid_value', 'part_payment', 'part_acquisition', 'standard', 'annex',
            'products', 'responsible_person', 'contact', 'seller'
        ]


class OneTimePersonSerializer(serializers.ModelSerializer):

    contact = ContactSerializer()

    class Meta:

        model = Person

        fields = ['first_name', 'last_name', 'fathers_name', 'position', 'contact', 'type', 'tin', 'fullname']


class OneTimeAnnexGetSerializer(serializers.ModelSerializer):

    seller = PersonSerializer()
    products = OneTimeProductSerializer(many=True)

    class Meta:

        model = BaseAnnex

        fields = ['request_no', 'payment_terms', 'delivery_terms', 'acquisition_terms', 'seller', 'products']


class OneTimeGetSerializer(ContractCreateBaseSerializer):

    seller = PersonSerializer()
    company = EntitySerializer()
    executor = OneTimePersonSerializer()
    annex = OneTimeAnnexGetSerializer()

    class Meta:
        model = OneTimeAgreement

        fields = [
            'sales_manager', 'created', 'company', 'executor', 'type', 'id',
            'final_amount_with_writing', 'price_offer', 'price_offer_validity', 'warranty_period',
            'unpaid_period', 'unpaid_value', 'part_payment', 'part_acquisition', 'standard', 'annex',
            'responsible_person', 'seller'
        ]


class InternationalCreateSerializer(ContractCreateBaseSerializer):

    class Meta:

        model = InternationalAgreement
        fields = [
            'contract_no', 'sales_manager', 'created', 'due_date', 'company', 'executor',
            'bank', 'bank_account', 'contact', 'responsible_person', 'type', 'country',
            'payment_condition'
        ]


class InternationalGetSerializer(serializers.ModelSerializer):

    company = EntitySerializer()
    executor = PersonSerializer()
    responsible_person = PersonSerializer()
    contract_no = serializers.CharField()
    bank = serializers.SerializerMethodField()
    contact = serializers.SerializerMethodField()
    bank_account = serializers.SerializerMethodField()

    class Meta:

        model = InternationalAgreement

        fields = [
            'contract_no', 'sales_manager', 'created', 'due_date', 'company', 'executor',
            'bank', 'bank_account', 'contact', 'responsible_person', 'type', 'id', 'country',
            'payment_condition'
        ]

    def get_contact(self, obj):

        if obj.responsible_person and obj.responsible_person.contact:
            return ContactSerializer(obj.responsible_person.contact).data
        return None

    def get_bank(self, obj):

        if obj.company and obj.company.bank_acc_list:

            return BankSerializer(obj.company.bank_acc_list.last().bank).data

        if obj.executor and obj.executor.b_acc_list:

            return BankSerializer(obj.executor.b_acc_list.last().bank).data

    def get_bank_account(self, obj):

        if obj.company and obj.company.bank_acc_list:

            return BankAccountSerializer(obj.company.bank_acc_list.last()).data

        if obj.executor and obj.executor.bankaccounts:

            return BankAccountSerializer(obj.executor.b_acc_list.last()).data


class CustomerCreateSerializer(ContractCreateBaseSerializer):

    class Meta:

        model = CustomerTemplateAgreement
        fields = [
            'contract_no', 'sales_manager', 'created', 'due_date', 'company', 'executor',
            'bank', 'bank_account', 'contact', 'responsible_person', 'type', 'custom_contract_type'
        ]


class CustomerGetSerializer(serializers.ModelSerializer):

    company = EntitySerializer()
    executor = PersonSerializer()
    responsible_person = PersonSerializer()
    contract_no = serializers.CharField()
    bank = serializers.SerializerMethodField()
    contact = serializers.SerializerMethodField()
    bank_account = serializers.SerializerMethodField()

    class Meta:

        model = CustomerTemplateAgreement

        fields = [
            'contract_no', 'sales_manager', 'created', 'due_date', 'company', 'executor',
            'bank', 'bank_account', 'contact', 'responsible_person', 'type', 'id', 'custom_contract_type'
        ]

    def get_contact(self, obj):

        if obj.responsible_person and obj.responsible_person.contact:
            return ContactSerializer(obj.responsible_person.contact).data
        return None

    def get_bank(self, obj):

        if obj.company and obj.company.bank_acc_list:

            return BankSerializer(obj.company.bank_acc_list.last().bank).data

        if obj.executor and obj.executor.b_acc_list:

            return BankSerializer(obj.executor.b_acc_list.last().bank).data

    def get_bank_account(self, obj):

        if obj.company and obj.company.bank_acc_list:

            return BankAccountSerializer(obj.company.bank_acc_list.last()).data

        if obj.executor and obj.executor.bankaccounts:

            return BankAccountSerializer(obj.executor.b_acc_list.last()).data


class POCreateSerializer(ContractCreateBaseSerializer):

    supplements = SupplementsSerializer(required=False, many=True)

    class Meta:
        model = POAgreement

        fields = [
            'po_number', 'sales_manager', 'created', 'due_date', 'company', 'type', 'supplements'
        ]


class POGetSerializer(ContractCreateBaseSerializer):

    supplements = SupplementsSerializer(many=True)

    class Meta:
        model = POAgreement

        fields = [
            'po_number', 'sales_manager', 'created', 'due_date', 'company', 'type', 'supplements'
        ]
    #
    # def get_supplement(self, obj):
    #
    #     if obj.supplements:
    #
    #         return SupplementsSerializer(obj.supplements.last()).data


class BankListSerializer(serializers.ModelSerializer):

    name = serializers.CharField(source='bank.name')
    code = serializers.CharField(source='bank.code')
    tin = serializers.CharField(source='bank.tin')
    company_name = serializers.SerializerMethodField()
    company_tin = serializers.SerializerMethodField()

    class Meta:

        model = BankAccount
        fields = ['company_name', 'company_tin', 'name', 'code', 'tin', 'account', 'address', 'city',
                  'swift_no', 'correspondent_account']

    def get_company_name(self, obj):

        if obj.company_owner:
            return obj.company_owner.name

    def get_company_tin(self, obj):

        if obj.company_owner:
            return obj.company_owner.tin


class ContactListSerializer(serializers.ModelSerializer):

    customer = serializers.CharField(source='person.agreement.company.name')
    responsible_person = serializers.SerializerMethodField()

    class Meta:

        model = Contact
        fields = ['customer', 'address', 'responsible_person', 'mobile', 'personal_email', 'web_site']

    def get_responsible_person(self, obj):

        return obj.person.fullname


class SalesManagerSerializer(serializers.ModelSerializer):

    class Meta:

        model = Person
        fields = ['id', 'fullname']


class SellerSerializer(serializers.ModelSerializer):

    class Meta:

        model = Person
        fields = ['id', 'fullname']
