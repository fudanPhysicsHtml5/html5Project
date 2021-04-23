from django.urls import path

from . import views


app_name = 'physics'

urlpatterns = [
    path('', views.index, name='index'),
    path('upload', views.upload, name='upload'),
    path('download/<int:id>', views.download, name='download'),
    # path('log_in', views.log_in),
    # path('log_out', views.log_out),
    # path('sign_up', views.sign_up),
    # path('change_password/', views.change_password)
]
