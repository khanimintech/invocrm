from django.shortcuts import render
from django.urls import path
from django.contrib.auth import views as auth_views

urlpatterns = [
    path('login/', auth_views.LoginView.as_view(template_name='login.html',
                                                redirect_authenticated_user=True), name='login'),

    path('index/', lambda r: render(r, 'index.html')),
    path('detail/', lambda r: render(r, 'detail.html')),
]