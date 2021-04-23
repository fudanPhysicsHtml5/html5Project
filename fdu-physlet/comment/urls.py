from django.urls import path
from . import views

app_name='comment'

urlpatterns = [
    path('post_comment/<int:project_id>', views.post_comment, name='project_comment'),
    path('post_comment/<int:project_id>/<int:parent_comment_id>', views.post_comment, name='comment_reply'),
]
