from django.contrib.auth import login, logout
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from api.v1.serializers.authorization import LoginSerializer
from invocrm.auth import CsrfExemptSessionAuthentication


class LoginAPIView(APIView):

    authentication_classes = (CsrfExemptSessionAuthentication, )
    serializer_class = LoginSerializer

    def post(self, request, *args, **kwargs):

        serializer = self.serializer_class(data=request.data, context={'request': request})

        if serializer.is_valid(raise_exception=True):
            user = serializer.validated_data.get('user')

            login(request, user)

            return Response({'user': LoginSerializer(user).data})


class LogoutAPIView(APIView):

    serializer_class = None

    def post(self, request, *args, **kwargs):

        logout(request)
        response = Response(status=status.HTTP_204_NO_CONTENT)
        return response
