from django.urls import path

from api.v1.views.contract import check_view

urlpatterns = [
    path(
        r'check-django/', check_view, name='check-django'
    )
]