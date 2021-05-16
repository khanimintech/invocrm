import django_filters
from api.main_models.contract import BaseContract, Company, BankAccount, Contact
from api.models import Person


class ContractFilterSet(django_filters.rest_framework.FilterSet):

    sales_manager = django_filters.ModelMultipleChoiceFilter(queryset=Person.objects.filter(type=Person.TYPE.SALES_MANAGER))

    company_name = django_filters.CharFilter(method='filter_company_name')

    created = django_filters.DateTimeFilter(field_name='created', lookup_expr='lte')
    due_date = django_filters.DateTimeFilter(field_name='due_date', lookup_expr='lte')

    def filter_company_name(self, queryset, name, value):

        if value:
            queryset = queryset.filter(company__name=value)
        return queryset

    class Meta:
        model = BaseContract
        fields = [
            'company_name', 'contract_no', 'type', 'status', 'created', 'due_date', 'sales_manager'
        ]


class ContactFilterSet(django_filters.rest_framework.FilterSet):

    responsible_person = django_filters.ModelMultipleChoiceFilter(queryset=Person.objects.filter(type=Person.TYPE.CONTACT))

    customer = django_filters.CharFilter(method='filter_customer')

    def filter_customer(self,  queryset, name, value):

        if value:
            queryset = queryset.filter(person__agreement__company__name=value)

        return queryset

    class Meta:
        model = Contact
        fields = ['customer', 'address', 'responsible_person', 'mobile', 'personal_email', 'web_site']


class BankFilterSet(django_filters.rest_framework.FilterSet):

    company_name = django_filters.CharFilter(method='filter_company_name')
    company_tin = django_filters.CharFilter(method='filter_company_tin')
    name = django_filters.CharFilter(method='filter_name')
    code = django_filters.CharFilter(method='filter_code')
    tin = django_filters.CharFilter(method='filter_tin')

    def filter_company_name(self, queryset, name, value):

        if value:
            queryset = queryset.filter(company__name=value)

        return queryset

    def filter_company_tin(self, queryset, name, value):

        if value:
            queryset = queryset.filter(company__tin=value)

        return queryset

    def filter_name(self, queryset, name, value):

        if value:
            queryset = queryset.filter(bank__name=value)

        return queryset

    def filter_code(self, queryset, name, value):

        if value:
            queryset = queryset.filter(bank__code=value)

        return queryset

    def filter_tin(self, queryset, name, value):

        if value:
            queryset = queryset.filter(bank__tin=value)

        return queryset

    class Meta:
        model = BankAccount
        fields = ['company_name', 'company_tin', 'name', 'code', 'tin', 'account', 'address', 'city',
                  'swift_no', 'correspondent_account']
