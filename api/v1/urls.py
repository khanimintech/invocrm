from django.urls import path, include
from rest_framework.routers import SimpleRouter

from api.v1.views.contract import check_view, ContractListAPIView, TradeAgreementCreateAPIView
from api.views import LoginAPIView

router = SimpleRouter()

urlpatterns = [
    path(
        r'check-django/', check_view, name='check-django'
    ),
    # path(
    #     r'', include(router.urls)
    # ),

    path('contracts/', ContractListAPIView.as_view(), name='contracts'),
    path('trade-create/', TradeAgreementCreateAPIView.as_view(), name='trade-create'),
    path('login', LoginAPIView.as_view(), name='login'),
]
