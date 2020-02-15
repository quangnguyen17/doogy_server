from django.urls import path
from . import views

urlpatterns = [
    path('', views.index),
    path('logout', views.logout),
    path('like/<int:user_id>', views.like),
    path('view_raw', views.view_raw),
    path('download', views.download),
    path('get_liked', views.get_liked),
    path('dashboard', views.dashboard)
]
