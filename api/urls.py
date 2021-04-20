from django.urls import path, include
from rest_framework.routers import DefaultRouter, SimpleRouter

from api.views import UserRegistrationView



urlpatterns = [
    path('v1.0/', include(('api.v1.urls', 'api'), namespace='v1')),
    path('reg', UserRegistrationView.as_view(), name='reg'),
    # path('contracts', ContractViewSet.as_view({'get': 'list'})),

    # There are many methods for versioning, for simple one:
    # Next(v1.1) api version refer to previous one with overriding particular
    # feature
]

