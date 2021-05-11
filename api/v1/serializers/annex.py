from rest_framework import serializers

from api.main_models.annex import BaseAnnex, ProductInvoiceItem
from django.utils import timezone


class AnnexSerializer(serializers.ModelSerializer):

    sum_no_invoice = serializers.SerializerMethodField()
    sum_with_invoice = serializers.SerializerMethodField()
    company_name = serializers.SerializerMethodField()
    contract_no = serializers.CharField(source='contract.contract_no')
    signature_date = serializers.SerializerMethodField()

    class Meta:

        model = BaseAnnex
        fields = ['id', 'company_name', 'request_no', 'contract_no', 'annex_no', 'sales_manager',
                  'payment_terms', 'sum_no_invoice', 'sum_with_invoice', 'annex_date', 'signature_date']

    def get_company_name(self, obj):

        if obj.contract._is_individual_contract:

            return 'N/A'
        else:
            return obj.contract.company.name

    def get_sum_no_invoice(self, obj):

        return 0

    def get_sum_with_invoice(self, obj):

        return 0

    def get_signature_date(self, obj):

        return timezone.now()


class ProductsCreateSerializer(serializers.ModelSerializer):

    class Meta:

        model = ProductInvoiceItem
        fields = ['name', 'unit', 'quantity', 'price', 'total']


class AnnexCreateSerializer(serializers.ModelSerializer):

    products = ProductsCreateSerializer(many=True)

    class Meta:

        model = BaseAnnex

        fields = ['contract', 'request_no', 'annex_date', 'payment_terms', 'delivery_terms',
                  'acquisition_terms', 'created', 'seller', 'sales_manager', 'products']

    def create(self, validated_data):

        products = validated_data.pop('products')

        annex = super().create(validated_data)

        if products:
            ProductInvoiceItem.objects.bulk_create(ProductInvoiceItem(annex=annex, **p) for p in products)

        return annex
