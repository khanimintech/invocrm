from rest_framework.viewsets import ModelViewSet

from api.main_models.annex import BaseAnnex
from api.v1.serializers.annex import AnnexSerializer


class AnnexViewSet(ModelViewSet):

    queryset = BaseAnnex.objects.all()
    serializer_class = AnnexSerializer

