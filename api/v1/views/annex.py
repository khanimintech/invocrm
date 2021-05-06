from rest_framework.viewsets import ModelViewSet

from api.main_models.annex import BaseAnnex


class AnnexViewSet(ModelViewSet):

    queryset = BaseAnnex.objects.all()
    serializer
