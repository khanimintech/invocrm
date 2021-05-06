from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.viewsets import ModelViewSet

from api.main_models.contract import BaseContract
from api.serializers import ContractListSerializer, TradeCreateSerializer, ServiceCreateSerializer, \
    DistributionCreateSerializer, AgentCreateSerializer, POCreateSerializer, RentCreateSerializer, \
    OneTimeCreateSerializer, InternationalCreateSerializer, CustomerCreateSerializer

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


def filter_status_count(qs, status):

    return qs.filter(status=status).count()


class ContractViewSet(ModelViewSet):

    queryset = BaseContract.objects.all()
    serializer_class = ContractListSerializer

    def get_queryset(self):
        queryset = self.queryset
        return queryset.filter(plant_name=self.request.user.plant_name)

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['user'] = self.request.user

        return context

    def get_serializer_class(self):

        contract_type = self.request.data.get('type', None)

        if self.action == 'create' and contract_type:

            return contract_create_serializer[contract_type]

        return super().get_serializer_class()


class ContractStatusStatAPIView(APIView):

    def get(self, request):

        qs = BaseContract.objects.filter(plant_name=request.user.plant_name)

        response = {
                'all_count': qs.count(),
                'in_process_count': filter_status_count(qs, BaseContract.Status.IN_PROCESS),
                'approved_count': filter_status_count(qs, BaseContract.Status.APPROVED),
                'expired_count': filter_status_count(qs, BaseContract.Status.EXPIRED),
                'expires_after_2_weeks': 0
            }
        return Response(response)
