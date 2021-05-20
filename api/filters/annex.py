import django_filters

from api.filters.contract import filter_qs_field
from api.main_models.annex import BaseAnnex
from api.models import Person


class AnnexFilterSet(django_filters.rest_framework.FilterSet):

    sales_manager = django_filters.CharFilter(method='filter_sales_manager')
    company_name = django_filters.CharFilter(method='filter_company_name')
    contract_no = django_filters.CharFilter(method='filter_contract_no')
    contract_type = django_filters.CharFilter(method='filter_contract_type')
    annex_no = django_filters.CharFilter(method='filter_annex_no')
    payment_terms = django_filters.CharFilter(method='filter_payment_terms')

    created = django_filters.DateFilter(field_name='created', lookup_expr='lte')

    def filter_sales_manager(self, queryset, name, value):

        return filter_qs_field(queryset, {'sales_manager__fullname__icontains': value}, value)

    def filter_company_name(self, queryset, name, value):

        return filter_qs_field(queryset, {'contract__company__name__icontains': value}, value)

    def filter_contract_no(self, queryset, name, value):

        return filter_qs_field(queryset, {'contract__contract_no__icontains': value}, value)

    def filter_contract_type(self, queryset, name, value):

        if value:

            return queryset.filter(contract__type=int(value))

        return queryset

    def filter_annex_no(self, queryset, name, value):

        return filter_qs_field(queryset, {'annex_no__icontains': value}, value)

    def filter_payment_terms(self, queryset, name, value):

        return filter_qs_field(queryset, {'payment_terms__icontains': value}, value)

    class Meta:

        model = BaseAnnex
        fields = ['company_name', 'request_no', 'contract_no', 'contract_type', 'annex_no', 'sales_manager',
                  'payment_terms', 'created']
