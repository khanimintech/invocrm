from rest_framework import serializers

from api.main_models.annex import BaseAnnex


class AnnexSerializer(serializers.ModelSerializer):

    class Meta:

        model = BaseAnnex
        fields = '__all__'

