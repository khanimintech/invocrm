from django.urls import path, include
from rest_framework.routers import SimpleRouter

from api.v1.views.annex import AnnexViewSet, UnitOfMeasureAPIView
from api.v1.views.contract import ContractViewSet, ContractStatusStatAPIView, ContactViewSet, BankViewSet, \
    SalesMangerApiView
from api.views import LoginAPIView
from api.v1.views.contract import StubAPI

router = SimpleRouter()

router.register('contracts', ContractViewSet, basename='contracts')
router.register('annexes', AnnexViewSet, basename='annexes')
router.register('contacts', ContactViewSet, basename='contacts')
router.register('banks', BankViewSet, basename='banks')

urlpatterns = [
    path('login', LoginAPIView.as_view(), name='login'),
    path(r'status-count/', ContractStatusStatAPIView.as_view(), name='status-count'),
    path(r'stub-api/', StubAPI.as_view(), name='stub-api'),
    path(r'sales-managers/', SalesMangerApiView.as_view(), name='sales-managers'),
    path(r'units/', UnitOfMeasureAPIView.as_view(), name='units')
]

urlpatterns += router.urls
