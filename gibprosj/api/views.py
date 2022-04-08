from django.shortcuts import render
from rest_framework.response import Response
from rest_framework import generics, status
from rest_framework.decorators import api_view
from rest_framework.parsers import JSONParser
from .models import User, Point
from .serializers import UserSerializer, PointSerializer
from django.views.generic import TemplateView

def main_view(request):
    return TemplateView.as_view(template_name = 'index.html')(request)

# Create your views here.

class UserView(generics.ListCreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer

class PointView(generics.ListCreateAPIView):
    queryset = Point.objects.all()
    serializer_class = PointSerializer

# @api_view(['GET', 'POST'])
# def point_list(request):

#     if request.method == 'GET':
#         points = Point.objects.all()
#         serializer = PointSerializer(points, many=True)
#         return Response(serializer.data)

#     elif request.method == 'POST':
#         serializer = PointSerializer(data=request.data)
#         if serializer.is_valid():
#             serializer.save()
#             return Response(serializer.data, status=status.HTTP_201_CREATED)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# @api_view(['GET', 'PUT', 'DELETE'])
# def point_detail(request, pk):
#     """
#     Retrieve, update or delete a code snippet.
#     """
#     try:
#         point = Point.objects.get(pk=pk)
#     except Point.DoesNotExist:
#         return Response(status=status.HTTP_404_NOT_FOUND)

#     if request.method == 'GET':
#         serializer = PointSerializer(point)
#         return Response(serializer.data)

#     elif request.method == 'PUT':
#         serializer = PointSerializer(point, data=request.data)
#         if serializer.is_valid():
#             serializer.save()
#             return Response(serializer.data)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

#     elif request.method == 'DELETE':
#         point.delete()
#         return Response(status=status.HTTP_204_NO_CONTENT)