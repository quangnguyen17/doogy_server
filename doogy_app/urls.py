from django.urls import path
from . import views

urlpatterns = [
    path('', views.index),
    path('logout', views.logout),
    path('like/<int:user_id>', views.like),
    path('dashboard', views.dashboard),
    path('view', views.view),
    path('update_dark_mode', views.update_dark_mode)
]
