from django.shortcuts import render
from django.urls import path, re_path
from django.contrib.auth import views as auth_views

urlpatterns = [
    # path('login/', auth_views.LoginView.as_view(template_name='login.html',
    #                                             redirect_authenticated_user=True), name='login'),

    re_path(r'^(.+)$', lambda r, url : render(r, 'index.html')),

]