from django.contrib.auth import authenticate
from rest_framework import serializers

from api.models import CustomUser


class LoginSerializer(serializers.Serializer):

    email = serializers.EmailField(required=True)
    password = serializers.CharField(write_only=True, required=True)

    def validate(self, attrs):
        email = attrs.get('email')
        password = attrs.get('password')
        try:
            user = CustomUser.objects.get(email__iexact=email)

        except CustomUser.DoesNotExist:

            raise serializers.ValidationError('User with that email does not exist')

        user = authenticate(self.context['request'], username=user.username, password=password)
        if user:
            return {'user': user}
        else:
            raise serializers.ValidationError('User with that email does not exist')
