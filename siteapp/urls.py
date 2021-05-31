from django.shortcuts import render
from django.urls import re_path

urlpatterns = [

    re_path(r'^(.*)$', lambda r, url : render(r, 'index.html')),

]