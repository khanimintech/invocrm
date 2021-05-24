from rest_framework import serializers

from api.main_models.annex import BaseAnnex, ProductInvoiceItem, UnitOfMeasure, AgentInvoiceItem, RentConditions, \
    RentItems


class AnnexSerializer(serializers.ModelSerializer):

    sum_no_invoice = serializers.SerializerMethodField()
    sum_with_invoice = serializers.SerializerMethodField()
    company_name = serializers.SerializerMethodField()
    contract_no = serializers.CharField(source='contract.contract_no')
    contract_type = serializers.SerializerMethodField()

    class Meta:

        model = BaseAnnex
        fields = ['id', 'company_name', 'request_no', 'contract_no', 'annex_no', 'sales_manager', 'payment_terms',
                  'sum_no_invoice', 'sum_with_invoice', 'annex_date', 'created', 'contract_type', 'with_vat']

    def get_company_name(self, obj):

        if obj.contract._is_individual_contract:

            return 'N/A'
        else:
            return obj.contract.company.name

    def get_sum_no_invoice(self, obj):

        return 0

    def get_sum_with_invoice(self, obj):

        return 0

    def get_contract_type(self, obj):

        return obj.contract.type


class ProductsCreateSerializer(serializers.ModelSerializer):

    class Meta:

        model = ProductInvoiceItem
        fields = ['name', 'unit', 'quantity', 'price', 'total']


class AnnexCreateSerializer(serializers.ModelSerializer):

    products = ProductsCreateSerializer(many=True)

    class Meta:

        model = BaseAnnex

        fields = ['contract', 'request_no', 'annex_date', 'payment_terms', 'delivery_terms',
                  'acquisition_terms', 'created', 'seller', 'sales_manager', 'products', 'with_vat']

    def create(self, validated_data):

        products = validated_data.pop('products')

        annex = super().create(validated_data)

        if products:
            ProductInvoiceItem.objects.bulk_create(ProductInvoiceItem(annex=annex, **p) for p in products)

        return annex


class AgentInvoiceItemSerializer(serializers.ModelSerializer):

    class Meta:

        model = AgentInvoiceItem

        fields = ['client_name', 'invoice_no', 'date', 'annex_no', 'paids_from_customer', 'agent_reward']


class AgentAnnexCreateSerializer(serializers.ModelSerializer):

    agent_items = AgentInvoiceItemSerializer(many=True)

    class Meta:

        model = BaseAnnex

        fields = ['contract', 'created', 'agent_items']

    def create(self, validated_data):

        agent_items = validated_data.pop('agent_items')

        annex = super().create(validated_data)

        if agent_items:
            AgentInvoiceItem.objects.bulk_create(AgentInvoiceItem(annex=annex, **i) for i in agent_items)

        return annex


class RentConditionsSerializer(serializers.ModelSerializer):

    class Meta:
        model = RentConditions
        fields = ['name',]


class RentItemsSerializer(serializers.ModelSerializer):

    class Meta:
        model = RentItems
        fields = ['item_name', 'term', 'quantity', 'one_day_rent', 'total', 'unit']


class RentAnnexCreateSerializer(serializers.ModelSerializer):

    rent_items = RentItemsSerializer(many=True)
    rent_conditions = RentConditionsSerializer(many=True)

    class Meta:
        model = BaseAnnex
        fields = ['contract', 'created', 'rent_items', 'rent_conditions']

    def create(self, validated_data):

        rent_items = validated_data.pop('rent_items')
        conditions = validated_data.pop('rent_conditions')

        annex = super().create(validated_data)

        if rent_items:
            RentItems.objects.bulk_create(RentItems(annex=annex, **i) for i in rent_items)

        if conditions:
            RentConditions.objects.bulk_create(RentConditions(annex=annex, **c) for c in conditions)

        return annex


class UnitSerializer(serializers.ModelSerializer):

    class Meta:

        model = UnitOfMeasure
        fields = '__all__'
