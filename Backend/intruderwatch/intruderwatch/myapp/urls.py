'''from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('camera-feed/', views.camera_feed_endpoint, name='camera_feed_endpoint'),
    path('camera/', views.camera_feed, name='camera_feed'),
]
'''
# myapp/urls.py
from django.urls import path
from . import views
from .views import RoIAPI, camera_feed_endpoint, redirect_to_stream

urlpatterns = [
    path('', redirect_to_stream),  # Redirect root path to camera stream
    path('stream/', camera_feed_endpoint, name='camera-stream'),
    path('api/roi/', RoIAPI.as_view(), name='roi-api'),
    path('camera-feed/', views.camera_feed, name='camera-feed')
]

