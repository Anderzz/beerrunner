from django.urls import path
from . import views

urlpatterns = [
    path('users', views.UserView.as_view()),
    path('points/', views.PointView.as_view()),
    #path('points/<int:pk>', views.point_detail),
]


