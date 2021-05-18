from django.shortcuts import render
from django.urls import path, re_path
from django.contrib.auth import views as auth_views

urlpatterns = [

    re_path(r'^(.*)$', lambda r, url : render(r, 'index.html')),

]