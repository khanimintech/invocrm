from django.db.models import IntegerField, Subquery, OuterRef, Count
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import status
from rest_framework.generics import ListAPIView
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet

from api.filters.annex import AnnexFilterSet
from api.main_models.annex import BaseAnnex, UnitOfMeasure, ProductInvoiceItem
from api.main_models.contract import BaseContract
from api.v1.serializers.annex import AnnexSerializer, AnnexCreateSerializer, UnitSerializer, AgentAnnexCreateSerializer, \
    RentAnnexCreateSerializer


class AnnexViewSet(ModelViewSet):

    queryset = BaseAnnex.objects.all()
    serializer_class = AnnexSerializer
    filter_backends = (DjangoFilterBackend,)
    filterset_class = AnnexFilterSet

    def get_queryset(self):



        queryset = self.queryset
        return queryset.filter(contract__plant_name=self.request.user.plant_name).a_invoice_sum()

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['user'] = self.request.user

        return context

    def get_serializer_class(self):

        if self.action == 'create':
            contract = BaseContract.objects.get(id=self.request.data.get('contract'))

            if contract.type == BaseContract.Type.AGENT:
                return AgentAnnexCreateSerializer
            if contract.type == BaseContract.Type.RENT:
                return RentAnnexCreateSerializer

            return AnnexCreateSerializer

        return super().get_serializer_class()


class AnnexStatusStatAPIView(ListAPIView):

    queryset = BaseAnnex.objects.all().a_invoice_sum()
    filter_backends = (DjangoFilterBackend,)
    filterset_class = AnnexFilterSet

    def get_queryset(self):

        queryset = self.queryset
        return queryset.filter(contract__plant_name=self.request.user.plant_name)

    def list(self, request, *args, **kwargs):

        qs = self.filter_queryset(self.get_queryset())

        response = {
            'all_count': qs.count(),
            'with_vat': sum([round(sum(filter(None, qs.filter(with_vat=True).values_list('sum_with_invoice', flat=True))), 2),
                             round(sum(filter(None, qs.filter(with_vat=True).values_list('sum_with_invoice_rent', flat=True))), 2)]),
            'vat_free': sum([sum(filter(None, qs.filter().values_list('sum_no_invoice', flat=True))),
                             sum(filter(None, qs.filter().values_list('sum_no_invoice_rent', flat=True)))])

        }

        return Response(response)


class UnitOfMeasureAPIView(ListAPIView):

    queryset = UnitOfMeasure.objects.all()
    serializer_class = UnitSerializer
