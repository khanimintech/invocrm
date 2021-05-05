from django.http import JsonResponse
from rest_framework.generics import ListAPIView, CreateAPIView
from rest_framework.response import Response

from api.main_models.contract import BaseContract
from api.serializers import ContractListSerializer, TradeCreateSerializer
    # , InternationalCreateSerializer, \
    # OneTimeCreateSerializer, RentCreateSerializer, POCreateSerializer, AgentCreateSerializer, \
    # DistributionCreateSerializer, ServiceCreateSerializer,


def check_view(request):

    return JsonResponse({
        'message': 'OK'
    })


class ContractListAPIView(ListAPIView):

    queryset = BaseContract.objects.all()
    serializer_class = ContractListSerializer

    def get_queryset(self):

        queryset = self.queryset
        return queryset.filter(plant_name=self.request.user.plant_name)

    def get_serializer_context(self):

        context = super().get_serializer_context()
        context['user'] = self.request.user

        return context


class TradeAgreementCreateAPIView(CreateAPIView):

    serializer_class = TradeCreateSerializer

    def get_serializer_context(self):

        context = super().get_serializer_context()

        context['user'] = self.request.user

        return context
