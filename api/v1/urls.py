from django.urls import path, include
from rest_framework.routers import SimpleRouter

from api.v1.views.annex import AnnexViewSet, UnitOfMeasureAPIView, AnnexStatusStatAPIView
from api.v1.views.authorization import LoginAPIView, LogoutAPIView
from api.v1.views.contract import ContractViewSet, ContractStatusStatAPIView, ContactViewSet, BankViewSet, \
    SalesMangerApiView, SellerApiView
from api.views import StubAPI

router = SimpleRouter()

router.register('contracts', ContractViewSet, basename='contracts')
router.register('annexes', AnnexViewSet, basename='annexes')
router.register('contacts', ContactViewSet, basename='contacts')
router.register('banks', BankViewSet, basename='banks')

urlpatterns = [
    path('login', LoginAPIView.as_view(), name='login'),
    path('logout', LogoutAPIView.as_view(), name='logout'),
    path(r'status-count/', ContractStatusStatAPIView.as_view(), name='status-count'),
    path(r'annex-status-count/', AnnexStatusStatAPIView.as_view(), name='annex-status-count'),
    path(r'stub-api/', StubAPI.as_view(), name='stub-api'),
    path(r'sales-managers/', SalesMangerApiView.as_view(), name='sales-managers'),
    path(r'sellers/', SellerApiView.as_view(), name='sellers'),
    path(r'units/', UnitOfMeasureAPIView.as_view(), name='units')
]

urlpatterns += router.urls
