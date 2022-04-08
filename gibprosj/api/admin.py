from django.contrib import admin
from .models import User, Point

myModels = [User, Point]
admin.site.register(myModels)
