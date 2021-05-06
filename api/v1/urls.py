from django.urls import path, include
from rest_framework.routers import SimpleRouter

from api.v1.views.contract import ContractViewSet, ContractStatusStatAPIView
from api.views import LoginAPIView

router = SimpleRouter()

router.register('contract', ContractViewSet, basename='contract')

urlpatterns = [
    path('login', LoginAPIView.as_view(), name='login'),
    path('status-count', ContractStatusStatAPIView.as_view(), name='status-count'),
]

urlpatterns += router.urls
