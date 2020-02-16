from django.urls import path
from . import views

urlpatterns = [
    path('', views.index),
    path('logout', views.logout),
    path('like/<int:user_id>', views.like),
    path('dashboard', views.dashboard),
    path('view', views.view),
]
