from django.shortcuts import render
from django.urls import path, re_path
from django.contrib.auth import views as auth_views

urlpatterns = [
    path('', lambda r: render(r, template_name='index.html')),

]