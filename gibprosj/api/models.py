from unicodedata import category
from django.db import models
#from django.contrib.gis.db import models

# Create your models here.
class User(models.Model):
    name = models.CharField(max_length=50, blank=True)
    age = models.IntegerField(null=True, blank=True)

grocery = "Grocery Store"
liquor = "Liquor Store"
retail = "Retail Store"
category_choices = (
    (grocery, "Grocery Store"),
    (liquor, "Liquor Store"),
    (retail, "Retail Store"),
)

class Point(models.Model):
    #id = models.IntegerField(read_only=True)
    created = models.DateTimeField(auto_now_add=True)
    category = models.CharField(max_length=9, choices=category_choices, default=grocery)
    label = models.CharField(max_length=50, blank=True)
    description = models.CharField(max_length=50, blank=True)
    lat = models.DecimalField(max_digits=22, decimal_places=16, blank=True, null=True)
    lng = models.DecimalField(max_digits=22, decimal_places=16, blank=True, null=True)
