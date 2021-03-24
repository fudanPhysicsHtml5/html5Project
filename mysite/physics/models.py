from django.db import models


# Create your models here.
class Projects(models.Model):
    name = models.CharField(max_length=200, primary_key=True)
    html_path = models.CharField(max_length=200, null=True)
    pic_path = models.CharField(max_length=200, null=True)


class UploadProjects(models.Model):
    name = models.CharField(max_length=200, primary_key = True)
    path = models.CharField(max_length=200)

    def add(self):
        projects = Projects(name=self.name, path=self.path)
        projects.save()
