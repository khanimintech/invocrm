from datetime import timedelta
from django.db.models import Q
from django.utils import timezone
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.exceptions import ValidationError
from rest_framework.generics import ListAPIView
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet

from api.choices import contract_map, contract_create_serializer, contract_get_serializer
from api.filters.contract import ContractFilterSet, BankFilterSet, ContactFilterSet, StatFilterSet

from api.main_models.contract import BaseContract, BankAccount, Contact
from api.models import Person
from api.v1.serializers.contract import ContractListSerializer, BankListSerializer, ContactListSerializer, \
    SalesManagerSerializer, SellerSerializer


def filter_status_count(qs, status):

    IN_PROCESS = 0
    APPROVED = 1
    EXPIRED = 2
    EXPIRES = 3

    two_week_for_expire = timezone.now() + timedelta(weeks=2)

    if status == EXPIRES:
        return qs.filter(due_date__lt=two_week_for_expire).exclude(Q(status=APPROVED) | Q(status=EXPIRED)).count()

    if status == IN_PROCESS:
        return qs.filter(status=IN_PROCESS).exclude(due_date__lt=two_week_for_expire).count()

    return qs.filter(status=status).count()


class ContractViewSet(ModelViewSet):

    queryset = BaseContract.objects.all()
    serializer_class = ContractListSerializer
    filter_backends = (DjangoFilterBackend,)
    filterset_class = ContractFilterSet

    def get_queryset(self):
        queryset = self.queryset
        return queryset.filter(plant_name=self.request.user.plant_name)

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['user'] = self.request.user

        return context

    def get_object(self, queryset=None):

        instance = super().get_object()

        if self.action == 'retrieve':

            return getattr(instance, contract_map[instance.type].__name__.lower())

        return instance

    def get_serializer_class(self, *args, **kwargs):

        if self.action == 'create':

            contract_type = self.request.data.get('type', None)

            return contract_create_serializer[contract_type]

        if self.action in ('retrieve', 'update'):

            contract_type = self.get_object().type

            return contract_get_serializer[contract_type]

        return super().get_serializer_class()

    def create(self, request, *args, **kwargs):
        if not request.data.get('type'):
            raise ValidationError('Please provide contract type')
        return super().create(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):

        instance = self.get_object()
        instance.status = BaseContract.Status.EXPIRED
        instance.save()

        return Response(ContractListSerializer(instance).data)


class ContractStatusStatAPIView(ListAPIView):

    queryset = BaseContract.objects.all()
    filter_backends = (DjangoFilterBackend,)
    filterset_class = StatFilterSet

    def get_queryset(self):
        queryset = self.queryset
        return queryset.filter(plant_name=self.request.user.plant_name)

    def list(self, request, *args, **kwargs):

        qs = self.filter_queryset(self.get_queryset())

        EXPIRES = 3

        response = {
            'all_count': qs.count(),
            'in_process_count': filter_status_count(qs, BaseContract.Status.IN_PROCESS),
            'approved_count': filter_status_count(qs, BaseContract.Status.APPROVED),
            'expired_count': filter_status_count(qs, BaseContract.Status.EXPIRED),
            'expires_in_2_weeks': filter_status_count(qs, EXPIRES)
        }

        return Response(response)


class BankViewSet(ModelViewSet):

    queryset = BankAccount.objects.all()
    serializer_class = BankListSerializer
    filter_backends = (DjangoFilterBackend,)
    filterset_class = BankFilterSet


class ContactViewSet(ModelViewSet):

    queryset = Contact.objects.filter(person__type=Person.TYPE.CONTACT)
    serializer_class = ContactListSerializer
    filter_backends = (DjangoFilterBackend,)
    filterset_class = ContactFilterSet


class SalesMangerApiView(ListAPIView):

    queryset = Person.objects.filter(type=Person.TYPE.SALES_MANAGER)
    serializer_class = SalesManagerSerializer


class SellerApiView(ListAPIView):

    queryset = Person.objects.filter(type=Person.TYPE.SELLER)
    serializer_class = SellerSerializer
