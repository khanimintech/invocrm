from django.urls import path, include
from rest_framework.routers import SimpleRouter

from api.v1.views.contract import check_view
from api.views import ContractViewSet, UserRegistrationView, LoginAPIView

router = SimpleRouter()
router.register('contracts', ContractViewSet, 'contracts')

urlpatterns = [
    path(
        r'check-django/', check_view, name='check-django'
    ),
    path(
        r'', include(router.urls)
    ),
    path('login', LoginAPIView.as_view(), name='login'),
]

print(path(
        r'contracts/', include(router.urls)
    )
)