import django_filters

from api.filters.contract import filter_qs_field
from api.main_models.annex import BaseAnnex
from api.models import Person


class AnnexFilterSet(django_filters.rest_framework.FilterSet):

    sales_manager = django_filters.ModelMultipleChoiceFilter(queryset=Person.objects.filter(type=Person.TYPE.SALES_MANAGER))

    company_name = django_filters.CharFilter(method='filter_company_name')
    contract_no = django_filters.CharFilter(method='filter_contract_no')

    def filter_company_name(self, queryset, name, value):

        return filter_qs_field(queryset, {'contract__company__name__icontains': value}, value)

    def filter_contract_no(self, queryset, name, value):

        return filter_qs_field(queryset, {'contract__contract_no__icontains': value}, value)

    class Meta:
        model = BaseAnnex
        fields = ['company_name', 'request_no', 'contract_no', 'annex_no', 'sales_manager']

#
# d = ['id', 'company_name', 'request_no', 'contract_no', 'annex_no', 'sales_manager',
#      'payment_terms', 'sum_no_invoice', 'sum_with_invoice', 'annex_date', 'signature_date',
#      'created', 'contract_type']
