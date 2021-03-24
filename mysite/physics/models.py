from django.db import models

# Create your models here.
class Projects(models.Model):
    name = models.CharField(max_length=200, primary_key = True)
    author = models.CharField(max_length=200, null=True)
    html_path = models.CharField(max_length=200, null=True)
    pic_path = models.CharField(max_length=200, null=True)
    #reason = models.CharField(max_length=200, null=True) #why delete the project
    status = models.BooleanField(default=False) #state of projects, has or has not been reviewed