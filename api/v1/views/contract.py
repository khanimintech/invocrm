from datetime import timedelta

from django.http import JsonResponse
from django.utils import timezone
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.exceptions import ValidationError
from rest_framework.generics import ListAPIView
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.viewsets import ModelViewSet

from api.filters.contract import ContractFilterSet, BankFilterSet, ContactFilterSet
from api.main_models.contract import BaseContract, BankAccount, Contact
from api.models import Person
from api.v1.serializers.contract import ContractListSerializer, TradeCreateSerializer, ServiceCreateSerializer, \
    DistributionCreateSerializer, AgentCreateSerializer, POCreateSerializer, RentCreateSerializer, \
    OneTimeCreateSerializer, InternationalCreateSerializer, CustomerCreateSerializer, BankListSerializer, \
    ContactListSerializer, SalesManagerSerializer

# from django_filters.rest_framework import DjangoFilterBackend

contract_create_serializer = {
    BaseContract.Type.TRADE: TradeCreateSerializer,
    BaseContract.Type.SERVICE: ServiceCreateSerializer,
    BaseContract.Type.DISTRIBUTION: DistributionCreateSerializer,
    BaseContract.Type.AGENT: AgentCreateSerializer,
    BaseContract.Type.PO: POCreateSerializer,
    BaseContract.Type.RENT: RentCreateSerializer,
    BaseContract.Type.ONE_TIME: OneTimeCreateSerializer,
    BaseContract.Type.INTERNATIONAL: InternationalCreateSerializer,
    BaseContract.Type.CUSTOMER: CustomerCreateSerializer
}


class StubAPI(APIView):

    def get(self, request):

        return JsonResponse({'data': [
            {
                'id': 1,
                'contract_id': 1,
                'company_name': 'Vacib MMC',
                'type': 'Birdəfəlik müqavilə',
                'created': '2018-09-02',
                'end_date': '2019-09-02',
                'sales_name': 'Asif Veliyev',
                'status': 'In process',
                'executor': 'Sabina ',
                'annex_count': 2,

            },
            {
                'id': 2,
                'contract_id': 2,
                'company_name': 'Vacib MMC',
                'type': 'Birdəfəlik müqavilə',
                'created': '2019-09-02',
                'end_date': '2020-09-02',
                'sales_name': 'Veli Veliyev',
                'status': 'Bitir',
                'executor': 'Ferid ',
                'annex_count': 4,

            },
             {
                'id': 3,
                'contract_id': 345,
                'company_name': 'MC Donalds',
                'type': 'Ikidefelik müqavilə',
                'created': '2019-09-02',
                'end_date': '2020-09-02',
                'sales_name': 'Eli Eliyev',
                'status': 'Bitirmir',
                'executor': 'Saleh',
                'annex_count': 0,

            },
             {
                'id': 4,
                'contract_id': 4,
                'company_name': 'Zeruri MMC',
                'type': 'UcDefelik müqavilə',
                'created': '2019-09-02',
                'end_date': '2020-09-02',
                'sales_name': 'Yamac Kocavali',
                'status': 'Bitdi Bitecek',
                'executor': 'Cumali',
                'annex_count': 4,

            },
             {
                'id': 5,
                'contract_id': 5,
                'company_name': 'Labud MMC',
                'type': 'NDefelik müqavilə',
                'created': '2019-09-02',
                'end_date': '2020-09-02',
                'sales_name': 'Sultan anne',
                'status': 'Bitede biler bitmiyede biler',
                'executor': 'Idris babaaag',
                'annex_count': 19,

            },
             {
                'id': 6,
                'contract_id': 6,
                'company_name': 'Sesverme MMC',
                'type': 'Elustu müqavilə',
                'created': '2019-09-02',
                'end_date': '2020-09-02',
                'sales_name': 'Alico Veliyev',
                'status': 'Gelme Tuzak',
                'executor': 'Akin Kocovali',
                'annex_count': 3,

            },
             {
                'id': 7,
                'contract_id': 7,
                'company_name': 'CukurSport MMC',
                'type': 'cukur evimiz',
                'created': '2019-09-02',
                'end_date': '2020-09-02',
                'sales_name': 'Vartolu',
                'status': 'Manqal',
                'executor': 'Azer Kurtulush',
                'annex_count': 24345,

            },
             {
                'id': 8,
                'contract_id': 2,
                'company_name': 'Cayxana MMC',
                'type': 'spoiler',
                'created': '2019-09-02',
                'end_date': '2020-09-02',
                'sales_name': 'Baykal',
                'status': 'Yavshak',
                'executor': 'Meke',
                'annex_count': 2,

            },
             {
                'id': 9,
                'contract_id': 9,
                'company_name': 'Vacib MMC',
                'type': 'Birdəfəlik müqavilə',
                'created': '2019-09-02',
                'end_date': '2020-09-02',
                'sales_name': 'Veli Veliyev',
                'status': 'Bitir',
                'executor': 'Ferid ',
                'annex_count': 4,

            },
        ]})


def filter_status_count(qs, status):

    EXPIRED = 2
    EXPIRES = 3

    two_week_for_expire = timezone.now() + timedelta(weeks=2)

    if status == EXPIRES and status != EXPIRED:
        return qs.filter(due_date__lt=two_week_for_expire).count()

    return qs.filter(status=status).exclude(due_date__lt=two_week_for_expire).count()


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

    def get_serializer_class(self):

        contract_type = self.request.data.get('type', None)

        if self.action == 'create':

            return contract_create_serializer[contract_type]

        return super().get_serializer_class()

    def create(self, request, *args, **kwargs):
        if not request.data.get('type'):
            raise ValidationError('Please provide contract type')
        return super().create(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):

        instance = self.get_object()
        instance.status = BaseContract.Status.EXPIRED

        return Response(ContractListSerializer(instance).data)


class ContractStatusStatAPIView(APIView):

    def get(self, request):

        EXPIRES = 3

        qs = BaseContract.objects.filter(plant_name=request.user.plant_name)

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
