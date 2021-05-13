import django_filters

from api.main_models.annex import BaseAnnex
from api.models import Person


class AnnexFilter(django_filters.rest_framework.FilterSet):

    sales_manager = django_filters.ModelMultipleChoiceFilter(queryset=Person.objects.all())

    company_name = django_filters.CharFilter(method='filter_company_name')
    contract_no = django_filters.CharFilter(method='filter_contract_no')

    def filter_company_name(self, queryset, name, value):

        if value:
            queryset = queryset.filter(contract__company__name=value)

        return queryset

    def filter_contract_no(self, queryset, name, value):

        if value:
            queryset = queryset.filter(contract__contract_no=value)

        return queryset

    class Meta:
        model = BaseAnnex
        fields = ['company_name', 'request_no', 'contract_no', 'annex_no', 'sales_manager']
