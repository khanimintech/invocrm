from django.contrib.auth import authenticate
from rest_framework import serializers
from rest_framework_simplejwt.serializers import PasswordField

from api.models import Contract, CustomUser, Client, Bank


class ContractSerializer(serializers.ModelSerializer):

    class Meta:

        model = Contract
        fields = '__all__'
        read_only_fields = fields

    def create(self, validated_data):

        user = self.context.get('user')

        Client.objects.create(**validated_data.pop('client'))
        Bank.objects.create(**validated_data.pop('bank'))

        contract = Contract.objects.create(**validated_data, creater=user)

        return contract


class LoginSerializer(serializers.Serializer):

    email = serializers.EmailField(required=True)
    password = serializers.CharField(write_only=True, style={'input_type': 'password'}, required=True)

    def validate(self, attrs):
        email = attrs.get('email')
        password = attrs.get('password')
        try:
            user = CustomUser.objects.get(email__iexact=email)

        except CustomUser.DoesNotExist:

            raise serializers.ValidationError('User with that email dose not exist')

        user = authenticate(username=user.email, password=password)

        if user:
            return {'user': user}


class UserRegistrationSerializer(serializers.ModelSerializer):

    password = PasswordField(required=False)

    class Meta:

        model = CustomUser
        fields = [
            'email', 'password', 'first_name', 'last_name'
        ]

