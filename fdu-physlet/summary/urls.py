from django.urls import path
from . import views

app_name = 'summary'

urlpatterns = [
    path('project-summary/<int:id>', views.project_summary, name='project_summary')
]
