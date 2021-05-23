from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.generics import ListAPIView
from rest_framework.viewsets import ModelViewSet

from api.filters.annex import AnnexFilterSet
from api.main_models.annex import BaseAnnex, UnitOfMeasure
from api.main_models.contract import BaseContract
from api.v1.serializers.annex import AnnexSerializer, AnnexCreateSerializer, UnitSerializer, AgentAnnexCreateSerializer, \
    RentAnnexCreateSerializer


class AnnexViewSet(ModelViewSet):

    queryset = BaseAnnex.objects.all()
    serializer_class = AnnexSerializer
    filter_backends = (DjangoFilterBackend, )
    filterset_class = AnnexFilterSet

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


class UnitOfMeasureAPIView(ListAPIView):

    queryset = UnitOfMeasure.objects.all()
    serializer_class = UnitSerializer
