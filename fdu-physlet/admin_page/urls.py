from django.urls import path

from . import views

urlpatterns = [
    path('', views.log_in),
    path('upload_projects', views.manage_upload_projects),
    path('manage_projects', views.manage_projects),
    path('add', views.add),
    path('delete', views.delete),
    path('log_in', views.log_in),
    path('log_out', views.log_out)
]