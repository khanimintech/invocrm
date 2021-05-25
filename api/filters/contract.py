import django_filters
from django.db.models import Q
from django.utils import timezone
from datetime import timedelta

from api.main_models.contract import BaseContract, Company, BankAccount, Contact
from api.models import Person


def filter_qs_field(qs, kwargs, value=None):

    if value:
        return qs.filter(**kwargs)
    return qs


class ContractFilterSet(django_filters.rest_framework.FilterSet):

    sales_manager = django_filters.CharFilter(method='filter_sales_manager')

    company_name = django_filters.CharFilter(method='filter_company_name')
    contract_no = django_filters.CharFilter(method='filter_contract_no')
    status = django_filters.NumberFilter(method='filter_status')

    created = django_filters.DateFilter(field_name='created', lookup_expr='gte')
    due_date = django_filters.DateFilter(field_name='due_date', lookup_expr='gte')
    contract_created = django_filters.DateFromToRangeFilter('created')

    def filter_sales_manager(self,  queryset, name, value):

        return filter_qs_field(queryset, {'sales_manager__fullname__icontains': value}, value)

    def filter_company_name(self, queryset, name, value):

        return filter_qs_field(queryset, {'company__name__icontains': value}, value)

    def filter_contract_no(self, queryset, name, value):

        return filter_qs_field(queryset, {'contract_no__startswith': value}, value)

    def filter_status(self, queryset, name, value):

        IN_PROCESS, APPROVED, EXPIRED, EXPIRES= range(0, 4)

        if value:
            two_week_for_expire = timezone.now() + timedelta(weeks=2)

            if value == EXPIRES:
                queryset = queryset.filter(due_date__lt=two_week_for_expire).exclude(status=EXPIRED)
            else:
                queryset = queryset.filter(status=value)

        return queryset

    class Meta:
        model = BaseContract
        fields = [
            'company_name', 'contract_no', 'type', 'status', 'created', 'due_date', 'sales_manager', 'contract_created'
        ]


class ContactFilterSet(django_filters.rest_framework.FilterSet):

    customer = django_filters.CharFilter(method='filter_customer')
    address = django_filters.CharFilter(method='filter_address')
    responsible_person = django_filters.CharFilter(method='filter_resp')
    mobile = django_filters.CharFilter(method='filter_mobile')
    personal_email = django_filters.CharFilter(method='filter_personal_email')
    web_site = django_filters.CharFilter(method='filter_web_site')

    def filter_customer(self,  queryset, name, value):

        if value:
            return queryset.filter(Q(person__agreement__executor__fullname__icontains=value) |
                                   Q(person__agreement__company__name__icontains=value))

        return queryset

    def filter_address(self, queryset, name, value):

        return filter_qs_field(queryset, {'address__icontains': value}, value)

    def filter_resp(self, queryset, name, value):

        if value:
            return queryset.filter(Q(person__first_name__icontains=value) | Q(person__last_name__icontains=value))

        return queryset

    def filter_mobile(self, queryset, name, value):

        return filter_qs_field(queryset, {'mobile__icontains': value}, value)

    def filter_personal_email(self, queryset, name, value):

        return filter_qs_field(queryset, {'personal_email__icontains': value}, value)

    def filter_web_site(self, queryset, name, value):

        return filter_qs_field(queryset, {'web_site__icontains': value}, value)

    class Meta:
        model = Contact
        fields = ['customer', 'address', 'responsible_person', 'mobile', 'personal_email', 'web_site']


class BankFilterSet(django_filters.rest_framework.FilterSet):

    company_name = django_filters.CharFilter(method='filter_company_name')
    company_tin = django_filters.CharFilter(method='filter_company_tin')
    name = django_filters.CharFilter(method='filter_name')
    code = django_filters.CharFilter(method='filter_code')
    tin = django_filters.CharFilter(method='filter_tin')

    account = django_filters.CharFilter(method='filter_account')
    address = django_filters.CharFilter(method='filter_address')
    city = django_filters.CharFilter(method='filter_city')
    swift_no = django_filters.CharFilter(method='filter_swift_no')
    correspondent_account = django_filters.CharFilter(method='filter_correspondent_account')

    def filter_company_name(self, queryset, name, value):

        return filter_qs_field(queryset, {'company__name__icontains': value}, value)

    def filter_company_tin(self, queryset, name, value):

        return filter_qs_field(queryset, {'company__tin__icontains': value}, value)

    def filter_name(self, queryset, name, value):

        return filter_qs_field(queryset, {'bank__name__icontains': value}, value)

    def filter_code(self, queryset, name, value):

        return filter_qs_field(queryset, {'bank__code__icontains': value}, value)

    def filter_tin(self, queryset, name, value):

        return filter_qs_field(queryset, {'bank__tin__icontains': value}, value)

    def filter_account(self, queryset, name, value):

        return filter_qs_field(queryset, {'account__icontains': value}, value)

    def filter_address(self, queryset, name, value):

        return filter_qs_field(queryset, {'address__icontains': value}, value)

    def filter_city(self, queryset, name, value):

        return filter_qs_field(queryset, {'city__icontains': value}, value)

    def filter_swift_no(self, queryset, name, value):

        return filter_qs_field(queryset, {'swift_no__icontains': value}, value)

    def filter_correspondent_account(self, queryset, name, value):

        return filter_qs_field(queryset, {'correspondent_account__icontains': value}, value)

    class Meta:
        model = BankAccount
        fields = ['company_name', 'company_tin', 'name', 'code', 'tin', 'account', 'address', 'city',
                  'swift_no', 'correspondent_account']
