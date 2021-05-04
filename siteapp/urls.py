from django.shortcuts import render
from django.urls import path, re_path
import re
from django.contrib.auth import views as auth_views

urlpatterns = [
    re_path(r'^(?P<path>.*)$', lambda r, path: render(r,  'index.html')),
    
]