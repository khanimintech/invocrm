from datetime import timedelta

from django.db.transaction import atomic
from django.utils import timezone
from rest_framework import serializers

from api.main_models.annex import BaseAnnex, POAgreementSupplements, ProductInvoiceItem
from api.main_models.contract import BaseContract, TradeAgreement, Contact, Company, Bank, BankAccount, \
    ServiceAgreement, DistributionAgreement, AgentAgreement, POAgreement, RentAgreement, OneTimeAgreement, \
    InternationalAgreement, CustomerTemplateAgreement
from api.models import Person

annex_map = {
    BaseAnnex: 'Trade'
}


def custom_update(instance, validated_data):

    def update_if_not_none(cls, id, data):
        if data:
            return cls.objects.filter(id=id).update(**data)

    update_if_not_none(Company, instance.company.id, validated_data.pop('company'))
    update_if_not_none(Person, instance.executor.id, validated_data.pop('executor'))
    instance.executor.refresh_from_db()
    update_if_not_none(Bank, instance.company.bank_acc_list.last().bank.id, validated_data.pop('bank', None))
    update_if_not_none(BankAccount, instance.company.bank_acc_list.last().bank.id, validated_data.pop('bank_account', None))

    responsible_person_data = validated_data.pop('responsible_person', None)
    contact_data = validated_data.pop('contact', None)

    if responsible_person_data is not None:

        if instance.responsible_person is not None:

            update_if_not_none(Person, instance.responsible_person.id, responsible_person_data)

            instance.responsible_person.refresh_from_db()
            rp = instance.responsible_person

            if contact_data is not None:

                if instance.responsible_person.contact is not None:
                    update_if_not_none(Contact, instance.responsible_person.contact.id, contact_data)

                if not instance.responsible_person.contact:

                    con = Contact.objects.create(**contact_data)
                    instance.responsible_person.contact = con
                    instance.responsible_person.save()

        if not instance.responsible_person:

            rp = Person.objects.create(**responsible_person_data)

            if contact_data is not None:
                con = Contact.objects.create(**contact_data)
                rp.contact = con

        # must call save() for Person objects to change fullname(changed in refactored save(), update() dont call save())

        rp.save()
        instance.executor.save()

        validated_data['responsible_person'] = rp

    return instance, validated_data


class EntitySerializer(serializers.ModelSerializer):

    class Meta:
        model = Company
        fields = '__all__'


class BankSerializer(serializers.ModelSerializer):

    class Meta:

        model = Bank
        fields = ['name', 'code', 'tin', 'id']


class PersonSerializer(serializers.ModelSerializer):

    class Meta:

        model = Person
        fields = ['first_name', 'last_name', 'fathers_name', 'tin', 'position', 'id']


class ContactPersonSerializer(serializers.ModelSerializer):

    class Meta:

        model = Person
        fields = ['first_name', 'last_name', 'fathers_name', 'position']


class ContactSerializer(serializers.ModelSerializer):

    class Meta:

        model = Contact
        fields = '__all__'


class PersonUpdateSerializer(serializers.ModelSerializer):

    position = serializers.CharField(required=False, allow_null=True, allow_blank=True)
    tin = serializers.CharField(required=False, allow_null=True, allow_blank=True)

    class Meta:
        model = Person

        fields = ['first_name', 'last_name', 'fathers_name', 'tin', 'position']


class SupplementsSerializer(serializers.ModelSerializer):

    class Meta:

        model = POAgreementSupplements
        fields = ['supplement_no', 'id']


class SupplementsUpdateSerializer(serializers.ModelSerializer):

    id = serializers.IntegerField(required=False)

    class Meta:

        model = POAgreementSupplements
        fields = ['supplement_no', 'id']


class BankAccountUpdateSerializer(serializers.ModelSerializer):

    class Meta:

        model = BankAccount
        fields = ['account', 'swift_no', 'correspondent_account', 'city', 'address', 'bank']


class CompanyUpdateSerializer(serializers.ModelSerializer):

    class Meta:
        model = Company
        fields = ['type', 'name', 'address', 'tin', 'email']


class ContactUpdateSerializer(serializers.ModelSerializer):

    class Meta:

        model = Contact
        fields = ['mobile', 'address', 'work_email', 'personal_email', 'web_site']


class BankAccountSerializer(serializers.ModelSerializer):

    class Meta:

        model = BankAccount
        fields = ['default', 'account', 'swift_no', 'correspondent_account', 'city', 'address', 'id']


class OneTimeProductSerializer(serializers.ModelSerializer):

    class Meta:

        model = ProductInvoiceItem
        fields = ['name', 'unit', 'quantity', 'price', 'total', 'id']


class OneTimeUpdateProductSerializer(serializers.ModelSerializer):

    id = serializers.IntegerField(required=False)

    class Meta:

        model = ProductInvoiceItem
        fields = ['name', 'unit', 'quantity', 'price', 'total', 'id']


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

        fields = ['request_no', 'payment_terms', 'delivery_terms', 'acquisition_terms', 'seller', 'products', 'total',
                  'with_vat', 'status']


class OneTimeUpdateAnnexSerializer(serializers.ModelSerializer):

    seller = PersonSerializer()
    products = OneTimeUpdateProductSerializer(many=True, required=False)

    class Meta:

        model = BaseAnnex

        fields = ['request_no', 'payment_terms', 'delivery_terms', 'acquisition_terms', 'seller', 'products', 'total',
                  'with_vat', 'status']


class OneTimeAnnexSerializer(serializers.ModelSerializer):

    seller = PersonSerializer(required=False)
    products = OneTimeProductSerializer(many=True, required=False)

    class Meta:
        model = BaseAnnex

        fields = ['request_no', 'payment_terms', 'delivery_terms', 'acquisition_terms', 'seller', 'products', 'total',
                  'with_vat', 'status']


class ContractListSerializer(serializers.ModelSerializer):

    company_name = serializers.SerializerMethodField()
    sales_manager = serializers.SerializerMethodField()
    annex_count = serializers.SerializerMethodField()
    status = serializers.SerializerMethodField()
    executor_name = serializers.SerializerMethodField()

    class Meta:

        model = BaseContract

        fields = ['id', 'company_name', 'contract_no', 'type', 'created', 'due_date', 'sales_manager',
                  'annex_count', 'status', 'executor_name']

    def get_sales_manager(self, obj):

        if obj.sales_manager is not None:
            return obj.sales_manager.fullname

    def get_executor_name(self, obj):

        if obj.executor is not None:
            return obj.executor.fullname

        return 'N/A'

    def get_company_name(self, obj):

        if obj._is_individual_contract:

            if obj.executor is not None:
                return obj.executor.fullname
            return None

        return obj.company.name

    def get_annex_count(self, obj):

        return obj.annex_list.filter(status=BaseAnnex.Status.APPROVED).count()

    def get_status(self, obj):

        APPROVED = 1
        EXPIRED = 2
        EXPIRES = 3
        CANCELED = 4

        two_week_for_expire = timezone.now() + timedelta(weeks=2)

        if obj.status not in [APPROVED, EXPIRED, CANCELED]:

            if obj.due_date is not None and obj.due_date < timezone.now():

                obj.status = EXPIRED
                obj.save()

            elif obj.due_date is not None and obj.due_date < two_week_for_expire:

                return EXPIRES

        return obj.status


class AttachmentSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    url = serializers.SerializerMethodField()

    name = serializers.CharField(source='attachment.name')
    created = serializers.DateTimeField()

    def get_url(self, obj):
        return self.context['request'].build_absolute_uri(obj.attachment.url)
    class Meta:
        fields = ('id', 'name', 'created', 'url')


class BaseContractAttachmentSerializer(serializers.ModelSerializer):
    contracts = AttachmentSerializer(source='attachments', many=True)
    annexes = AttachmentSerializer(source='annex_attachments', many=True)
    other = AttachmentSerializer(source='other_attachments', many=True)

    class Meta:
        model = BaseContract
        fields = ('contracts', 'annexes', 'other')


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
        from api.choices import CONTRACT_CHOICE

        def create_pop_or_none(cls, field_name, **kwargs):
            return cls.objects.create(**kwargs, **validated_data.pop(field_name)) if validated_data.get(field_name,
                                                                                                        None) else None
        user = self.context.get('user')

        annex_data = validated_data.pop('annex', None)

        supplements_data = validated_data.pop('supplements', None)

        contact = create_pop_or_none(Contact, 'contact')

        executor_contact = create_pop_or_none(Contact, 'executor_contact')

        responsible_person = create_pop_or_none(Person, 'responsible_person', **{'type': Person.TYPE.CONTACT, 'contact': contact})

        executor = create_pop_or_none(Person, 'executor', **{'type': Person.TYPE.BUYER, 'contact': executor_contact})

        company = create_pop_or_none(Company, 'company')

        bank = create_pop_or_none(Bank, 'bank')

        create_pop_or_none(BankAccount, 'bank_account', **{'company_owner': company, 'personal_owner': executor, 'bank': bank})

        contract = CONTRACT_CHOICE[validated_data['type']].objects.create(plant_name=user.plant_name, company=company,
                                                                          responsible_person=responsible_person,
                                                                          executor=executor, **validated_data)

        if contract.type == BaseContract.Type.ONE_TIME and annex_data:

            products_data = annex_data.pop('products', None)
            seller_data = annex_data.pop('seller', None)

            seller = None

            if seller_data:
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
    responsible_person = PersonSerializer(required=False)
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

        if obj.executor and obj.executor.b_acc_list:

            return BankAccountSerializer(obj.executor.b_acc_list.last()).data


class TradeUpdateSerializer(serializers.ModelSerializer):

    company = CompanyUpdateSerializer()
    executor = PersonUpdateSerializer()
    responsible_person = PersonUpdateSerializer(required=False, allow_null=True)
    bank = BankSerializer(required=False, allow_null=True)
    bank_account = BankAccountSerializer(required=False, allow_null=True)
    contact = ContactUpdateSerializer(required=False, allow_null=True)

    class Meta:
        model = TradeAgreement

        fields = [
            'contract_no', 'sales_manager', 'created', 'due_date', 'company', 'executor',
            'responsible_person', 'type', 'bank', 'bank_account', 'contact', 'status'
        ]

    def update(self, instance, validated_data):
        instance, validated_data = custom_update(instance, validated_data)

        return super().update(instance.tradeagreement, validated_data)


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
    responsible_person = PersonSerializer(required=False)
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

        if obj.executor and obj.executor.b_acc_list:

            return BankAccountSerializer(obj.executor.b_acc_list.last()).data


class ServiceUpdateSerializer(serializers.ModelSerializer):

    company = CompanyUpdateSerializer()
    executor = PersonUpdateSerializer()
    responsible_person = PersonUpdateSerializer(required=False, allow_null=True)
    bank = BankSerializer(required=False, allow_null=True)
    bank_account = BankAccountSerializer(required=False, allow_null=True)
    contact = ContactUpdateSerializer(required=False, allow_null=True)

    class Meta:
        model = ServiceAgreement

        fields = [
            'contract_no', 'sales_manager', 'created', 'due_date', 'company', 'executor',
            'responsible_person', 'type', 'bank', 'bank_account', 'contact', 'status'
        ]

    def update(self, instance, validated_data):

        instance, validated_data = custom_update(instance, validated_data)

        return super().update(instance.serviceagreement, validated_data)


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
    responsible_person = PersonSerializer(required=False)
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

        if obj.executor and obj.executor.b_acc_list:

            return BankAccountSerializer(obj.executor.b_acc_list.last()).data


class DistributionUpdateSerializer(serializers.ModelSerializer):

    company = CompanyUpdateSerializer()
    executor = PersonUpdateSerializer()
    responsible_person = PersonUpdateSerializer(required=False, allow_null=True)
    bank = BankSerializer(required=False, allow_null=True)
    bank_account = BankAccountSerializer(required=False, allow_null=True)
    contact = ContactUpdateSerializer(required=False, allow_null=True)

    class Meta:
        model = DistributionAgreement

        fields = [
            'contract_no', 'sales_manager', 'created', 'due_date', 'company', 'executor',
            'bank', 'bank_account', 'contact', 'responsible_person', 'type', 'territory',
            'subject_of_distribution', 'status'
        ]

    def update(self, instance, validated_data):

        instance, validated_data = custom_update(instance, validated_data)

        return super().update(instance.distributionagreement, validated_data)


class AgentCreateSerializer(ContractCreateBaseSerializer):

    class Meta:
        model = AgentAgreement

        fields = [
            'contract_no', 'sales_manager', 'created', 'due_date', 'company', 'executor',
            'bank', 'bank_account', 'contact', 'responsible_person', 'type', 'territory',
        ]


class AgentGetSerializer(serializers.ModelSerializer):

    executor = PersonSerializer()
    responsible_person = PersonSerializer(required=False)
    contract_no = serializers.CharField()
    bank = serializers.SerializerMethodField()
    contact = serializers.SerializerMethodField()
    bank_account = serializers.SerializerMethodField()

    class Meta:

        model = AgentAgreement

        fields = [
            'contract_no', 'sales_manager', 'created', 'due_date', 'executor',
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

        if obj.executor and obj.executor.b_acc_list:

            return BankAccountSerializer(obj.executor.b_acc_list.last()).data


class AgentUpdateSerializer(serializers.ModelSerializer):

    executor = PersonUpdateSerializer()
    responsible_person = PersonUpdateSerializer(required=False, allow_null=True)
    bank = BankSerializer(required=False, allow_null=True)
    bank_account = BankAccountSerializer(required=False, allow_null=True)
    contact = ContactUpdateSerializer(required=False, allow_null=True)

    class Meta:
        model = AgentAgreement

        fields = [
            'contract_no', 'sales_manager', 'created', 'due_date', 'executor', 'status'
            'bank', 'bank_account', 'contact', 'responsible_person', 'type', 'territory',
        ]

    def update(self, instance, validated_data):

        def update_if_not_none(cls, id, data):
            if data:
                return cls.objects.filter(id=id).update(**data)

        update_if_not_none(Person, instance.executor.id, validated_data.pop('executor'))
        instance.executor.refresh_from_db()
        update_if_not_none(Bank, instance.executor.b_acc_list.last().bank.id, validated_data.pop('bank', None))
        update_if_not_none(BankAccount, instance.executor.b_acc_list.last().bank.id, validated_data.pop('bank_account', None))

        responsible_person_data = validated_data.pop('responsible_person', None)
        contact_data = validated_data.pop('contact', None)

        if responsible_person_data is not None and instance.responsible_person is not None:

            update_if_not_none(Person, instance.responsible_person.id, responsible_person_data)
            instance.responsible_person.refresh_from_db()
            rp = instance.responsible_person
            if contact_data is not None and instance.responsible_person.contact is not None:
                update_if_not_none(Contact, instance.responsible_person.contact.id, contact_data)

            if contact_data is not None and not instance.responsible_person.contact:
                con = Contact.objects.create(**contact_data)
                instance.responsible_person.contact = con
                instance.responsible_person.save()

        if responsible_person_data is not None and not instance.responsible_person:

            rp = Person.objects.create(**responsible_person_data)
            if contact_data is not None:
                con = Contact.objects.create(**contact_data)
                rp.contact = con

        # must call save() for Person objects to change fullname(changed in refactored save(), update() dont call save())
        instance.executor.save()
        rp.save()

        validated_data['responsible_person'] = rp

        return super().update(instance.agentagreement, validated_data)


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
    responsible_person = PersonSerializer(required=False)
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

        if obj.executor and obj.executor.b_acc_list:

            return BankAccountSerializer(obj.executor.b_acc_list.last()).data


class RentUpdateSerializer(serializers.ModelSerializer):

    company = CompanyUpdateSerializer()
    executor = PersonUpdateSerializer()
    responsible_person = PersonUpdateSerializer(required=False, allow_null=True)
    bank = BankSerializer(required=False, allow_null=True)
    bank_account = BankAccountSerializer(required=False, allow_null=True)
    contact = ContactUpdateSerializer(required=False, allow_null=True)

    class Meta:
        model = RentAgreement

        fields = [
            'contract_no', 'sales_manager', 'created', 'due_date', 'company', 'executor',
            'responsible_person', 'type', 'bank', 'bank_account', 'contact', 'status'
        ]

    def update(self, instance, validated_data):

        instance, validated_data = custom_update(instance, validated_data)

        return super().update(instance.rentagreement, validated_data)


class OneTimeCreateSerializer(ContractCreateBaseSerializer):

    executor_contact = ContactSerializer(required=False)
    annex = OneTimeAnnexSerializer(required=False)
    products = OneTimeProductSerializer(required=False, many=True)

    class Meta:
        model = OneTimeAgreement

        fields = [
            'sales_manager', 'created', 'company', 'executor', 'executor_contact', 'type',
            'final_amount_with_writing', 'price_offer', 'price_offer_validity', 'warranty_period',
            'unpaid_period', 'unpaid_value', 'part_payment', 'part_acquisition', 'standard', 'annex',
            'products', 'responsible_person', 'contact'
        ]


class OneTimeGetSerializer(ContractCreateBaseSerializer):

    company = EntitySerializer()
    executor = OneTimePersonSerializer()
    annex = serializers.SerializerMethodField()

    class Meta:
        model = OneTimeAgreement

        fields = [
            'sales_manager', 'created', 'company', 'executor', 'type', 'id',
            'final_amount_with_writing', 'price_offer', 'price_offer_validity', 'warranty_period',
            'unpaid_period', 'unpaid_value', 'part_payment', 'part_acquisition', 'standard', 'annex',
            'responsible_person',
        ]

    def get_annex(self, obj):

        return OneTimeAnnexGetSerializer(obj.annex_list.last()).data


class OneTimeUpdateSerializer(serializers.ModelSerializer):

    company = CompanyUpdateSerializer(required=False)
    executor = OneTimePersonSerializer()
    annex = OneTimeUpdateAnnexSerializer(required=False)

    class Meta:
        model = OneTimeAgreement

        fields = [
            'sales_manager', 'created', 'company', 'executor', 'type', 'id',
            'final_amount_with_writing', 'price_offer', 'price_offer_validity', 'warranty_period',
            'unpaid_period', 'unpaid_value', 'part_payment', 'part_acquisition', 'standard', 'annex',
            'responsible_person', 'status'
        ]

    @atomic
    def update(self, instance, validated_data):

        def update_if_not_none(cls, id, data):
            if data:
                return cls.objects.filter(id=id).update(**data)
        if instance.company:
            update_if_not_none(Company, instance.company.id, validated_data.pop('company', None))

        executor_data = validated_data.pop('executor', None)
        executor_contact_data = executor_data.pop('contact', None)

        update_if_not_none(Contact, instance.executor.contact.id, executor_contact_data)
        update_if_not_none(Person, instance.executor.id, executor_data)
        instance.executor.refresh_from_db()

        annex_data = validated_data.pop('annex')
        seller_data = annex_data.pop('seller')
        products_data = annex_data.pop('products')

        update_if_not_none(Person, instance.annex_list.last().seller.id, seller_data)
        instance.annex_list.last().seller.refresh_from_db()
        update_if_not_none(BaseAnnex, instance.annex_list.last().id, annex_data)

        instance.annex_list.last().products.all().delete()

        for p in products_data:

            ProductInvoiceItem.objects.create(annex=instance.annex_list.last(), **p)

        # must call save() for Person objects to change fullname(changed in refactored save(), update() dont call save())
        instance.executor.save()
        instance.annex_list.last().seller.save()

        return super().update(instance.onetimeagreement, validated_data)


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
    responsible_person = PersonSerializer(required=False)
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

        if obj.executor and obj.executor.b_acc_list:

            return BankAccountSerializer(obj.executor.b_acc_list.last()).data


class InternationalUpdateSerializer(serializers.ModelSerializer):

    company = CompanyUpdateSerializer()
    executor = PersonUpdateSerializer()
    responsible_person = PersonUpdateSerializer(required=False, allow_null=True)
    bank = BankSerializer(required=False, allow_null=True)
    bank_account = BankAccountSerializer(required=False, allow_null=True)
    contact = ContactUpdateSerializer(required=False, allow_null=True)

    class Meta:
        model = InternationalAgreement

        fields = [
            'contract_no', 'sales_manager', 'created', 'due_date', 'company', 'executor',
            'bank', 'bank_account', 'contact', 'responsible_person', 'type', 'country',
            'payment_condition', 'status'
        ]

    def update(self, instance, validated_data):

        instance, validated_data = custom_update(instance, validated_data)

        return super().update(instance.internationalagreement, validated_data)


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
    responsible_person = PersonSerializer(required=False)
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

        if obj.executor and obj.executor.b_acc_list:

            return BankAccountSerializer(obj.executor.b_acc_list.last()).data


class CustomerUpdateSerializer(serializers.ModelSerializer):

    company = CompanyUpdateSerializer()
    executor = PersonUpdateSerializer()
    responsible_person = PersonUpdateSerializer(required=False, allow_null=True)
    bank = BankSerializer(required=False, allow_null=True)
    bank_account = BankAccountSerializer(required=False, allow_null=True)
    contact = ContactUpdateSerializer(required=False, allow_null=True)

    class Meta:
        model = CustomerTemplateAgreement

        fields = [
            'contract_no', 'sales_manager', 'created', 'due_date', 'company', 'executor', 'status'
            'bank', 'bank_account', 'contact', 'responsible_person', 'type', 'custom_contract_type'
        ]

    def update(self, instance, validated_data):

        instance, validated_data = custom_update(instance, validated_data)

        return super().update(instance.customertemplateagreement, validated_data)


class POCreateSerializer(ContractCreateBaseSerializer):

    supplements = SupplementsSerializer(required=False, many=True)

    class Meta:
        model = POAgreement

        fields = [
            'po_number', 'sales_manager', 'created', 'due_date', 'company', 'type', 'supplements'
        ]


class POGetSerializer(ContractCreateBaseSerializer):

    supplements = SupplementsSerializer(many=True)
    company = EntitySerializer()

    class Meta:
        model = POAgreement

        fields = [
            'po_number', 'sales_manager', 'created', 'due_date', 'company', 'type', 'supplements', 'id'
        ]


class POUpdateSerializer(serializers.ModelSerializer):

    supplements = SupplementsUpdateSerializer(many=True, required=False)
    company = CompanyUpdateSerializer()

    class Meta:
        model = POAgreement

        fields = [
            'po_number', 'sales_manager', 'created', 'due_date', 'company', 'type', 'supplements', 'id', 'status'
        ]

    @atomic
    def update(self, instance, validated_data):

        def update_if_not_none(cls, id, data):

            if data:
                return cls.objects.filter(id=id).update(**data)

        update_if_not_none(Company, instance.company.id, validated_data.pop('company', None))

        supplements_data = validated_data.pop('supplements')

        instance.poagreement.supplements.all().delete()

        for s in supplements_data:

            POAgreementSupplements.objects.create(agreement=instance.poagreement, **s)

        return super().update(instance.poagreement, validated_data)


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
        if obj.personal_owner:
            return obj.personal_owner.fullname

    def get_company_tin(self, obj):

        if obj.company_owner:
            return obj.company_owner.tin
        if obj.personal_owner:
            return obj.personal_owner.fullname


class ContactListSerializer(serializers.ModelSerializer):

    customer = serializers.SerializerMethodField()
    responsible_person = serializers.SerializerMethodField()

    class Meta:

        model = Contact
        fields = ['id', 'customer', 'address', 'responsible_person', 'mobile', 'personal_email', 'web_site',
                  'work_email', 'custom']

    def get_responsible_person(self, obj):

        if obj.person.type == Person.TYPE.CONTACT:
            return obj.person.fullname

    def get_customer(self, obj):

        if obj.company_name is not None:
            return obj.company_name

        elif getattr(obj.person, 'agreement', None) and not obj.person.agreement._is_individual_contract:
                return obj.person.agreement.company.name

        elif getattr(obj.person, 'agreement', None) and obj.person.agreement._is_individual_contract:
                return obj.person.agreement.executor.fullname


class ContactCreateSerializer(serializers.ModelSerializer):

    responsible_person = ContactPersonSerializer(required=False)

    class Meta:

        model = Contact
        fields = ['address', 'mobile', 'personal_email', 'web_site', 'work_email', 'responsible_person', 'company_name']

    def create(self, validated_data):

        responsible_person = validated_data.pop('responsible_person', None)

        validated_data['custom'] = True

        contact = super().create(validated_data)
        Person.objects.create(type=Person.TYPE.CONTACT, contact=contact, **responsible_person)

        return contact


class ContactEditSerializer(serializers.ModelSerializer):

    responsible_person = ContactPersonSerializer(required=False)

    class Meta:

        model = Contact
        fields = ['address', 'mobile', 'personal_email', 'web_site', 'work_email', 'responsible_person', 'company_name']

    def update(self, instance, validated_data):

        responsible_person = validated_data.pop('responsible_person', None)

        contact = super().update(instance, validated_data)

        Person.objects.filter(contact=instance).update(type=Person.TYPE.CONTACT, contact=contact, **responsible_person)

        return contact


class ContactGetSerializer(serializers.ModelSerializer):

    responsible_person = ContactPersonSerializer(source='person')

    class Meta:

        model = Contact
        fields = ['address', 'mobile', 'personal_email', 'web_site', 'work_email', 'responsible_person',
                  'company_name', 'custom']


class SalesManagerSerializer(serializers.ModelSerializer):

    class Meta:

        model = Person
        fields = ['id', 'fullname']


class SellerSerializer(serializers.ModelSerializer):

    class Meta:

        model = Person
        fields = ['id', 'fullname']
