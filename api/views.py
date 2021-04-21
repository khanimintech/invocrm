from django.contrib.auth import login, authenticate
from django.core.checks import messages
from django.shortcuts import render, redirect
from rest_framework import mixins, status
from rest_framework.authentication import SessionAuthentication
from rest_framework.generics import CreateAPIView
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.viewsets import GenericViewSet, ModelViewSet

from api.models import Contract
from api.serilizers import ContractSerializer, LoginSerializer, UserRegistrationSerializer


class LoginAPIView(APIView):

    serializer_class = LoginSerializer

    def post(self, request, *args, **kwargs):

        serializer = self.serializer_class(data=request.data, context={'request': request})

        if serializer.is_valid(raise_exception=True):
            user = serializer.validated_data.get('user')

            login(request, user)

            return Response({'user': LoginSerializer(user).data})
        # else:
        #     return Response(serializer.errors)

class UserRegistrationView(CreateAPIView):

    serializer_class = UserRegistrationSerializer

    def create(self, request, *args, **kwargs):

        register_serializer = self.get_serializer(data=request.data)
        register_serializer.is_valid(raise_exception=True)

        self.perform_create(register_serializer)

        login_serializer = LoginSerializer(
            data=register_serializer.validated_data, context=self.get_serializer_context()
        )

        login_serializer.is_valid(raise_exception=True)

        user = login_serializer.validated_data.get('user')

        response = Response({'user': LoginSerializer(user).data}, status=status.HTTP_201_CREATED)
        login(request, response, user)

        return response


class ContractViewSet(ModelViewSet):

    queryset = Contract.objects.all()
    serializer_class = ContractSerializer

    def get_queryset(self):

        queryset = self.queryset
        print(queryset, 'alaaaaa')
        return queryset.filter(creator=self.request.user)

    def get_serializer_context(self):

        context = super().get_serializer_context()
        context['user'] = self.request.user

        return context

