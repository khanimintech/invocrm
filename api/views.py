from django.contrib.auth import login
from rest_framework.response import Response
from rest_framework.views import APIView


from api.serializers import LoginSerializer
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
        # else:
        #     return Response(serializer.errors)
