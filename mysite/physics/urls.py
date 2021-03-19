from django.urls import path

from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('index', views.index),
    path('download', views.download),
    path('upload', views.upload),
    # path('model', views.model),
    path('log_in', views.log_in),
    path('log_out', views.log_out),
    path('sign_up', views.sign_up),
    path('change_password/', views.change_password)
]
