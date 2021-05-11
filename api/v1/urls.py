from django.urls import path, include
from rest_framework.routers import SimpleRouter

from api.v1.views.annex import AnnexViewSet
from api.v1.views.contract import ContractViewSet, ContractStatusStatAPIView, ContactViewSet, BankViewSet
from api.views import LoginAPIView
from api.v1.views.contract import StubAPI

router = SimpleRouter()

router.register('contract', ContractViewSet, basename='contract')
router.register('annex', AnnexViewSet, basename='annex')
router.register('contact', ContactViewSet, basename='contact')
router.register('bank', BankViewSet, basename='bank')

urlpatterns = [
    path('login', LoginAPIView.as_view(), name='login'),
    path('status-count/', ContractStatusStatAPIView.as_view(), name='status-count'),
    path(r'stub-api/', StubAPI.as_view(), name='stub-api')
]

urlpatterns += router.urls
