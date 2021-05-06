from django.urls import path

from api.v1.views.contract import check_view, StubAPI

urlpatterns = [
    path(
        r'check-django/', check_view, name='check-django',
    ),
    path(r'stub-api/', StubAPI.as_view(), name='stub-api')
]