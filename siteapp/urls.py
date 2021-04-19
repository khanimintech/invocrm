from django.shortcuts import render
from django.urls import path


urlpatterns = [
    path('login/', lambda r: render(r, 'signin.html')),
    path('index/', lambda r: render(r, 'index.html')),
    path('detail/', lambda r: render(r, 'detail.html')),
]