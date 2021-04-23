from django.urls import path

from . import views

app_name = 'admin_page'

urlpatterns = [
    path('', views.log_in),
    path('upload_projects', views.manage_upload_projects, name='upload_projects'),
    path('manage_projects', views.manage_projects, name='manage_projects'),
    path('add', views.add, name = 'add'),
    path('delete', views.delete, name = 'delete'),
    path('log_in', views.log_in, name = 'log_in'),
    path('log_out', views.log_out, name = 'log_out')
]