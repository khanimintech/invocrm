from django.http import JsonResponse
from rest_framework.response import Response


def check_view(request):

    return JsonResponse({
        'message': 'OK'
    })