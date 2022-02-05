from django.shortcuts import render
from rest_framework import generics
from .models import User
from .serializers import UserSerializer
from django.views.generic import TemplateView

def main_view(request):
    return TemplateView.as_view(template_name = 'index.html')(request)

# Create your views here.

class UserView(generics.ListCreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer