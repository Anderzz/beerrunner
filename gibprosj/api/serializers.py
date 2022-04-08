from rest_framework import serializers
from .models import User, Point

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('name', 'age')

class PointSerializer(serializers.ModelSerializer):
    class Meta:
        model = Point
        fields = ('id', 'category', 'label', 'description','lat', 'lng')

