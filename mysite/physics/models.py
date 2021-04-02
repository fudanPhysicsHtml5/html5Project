from django.db import models
from django.conf import settings


# Create your models here.
# class Projects(models.Model):
#     name = models.CharField(max_length=200, primary_key=True)
#     html_path = models.CharField(max_length=200, null=True)
#     pic_path = models.CharField(max_length=200, null=True)
#
#
# class UploadProjects(models.Model):
#     name = models.CharField(max_length=200, primary_key = True)
#     path = models.CharField(max_length=200)
#
#     def add(self):
#         projects = Projects(name=self.name, path=self.path)
#         projects.save()


class Project(models.Model):
    """ The Project Models """

    user = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='projects', on_delete=models.CASCADE)
    title = models.CharField(max_length=128, blank=True)
    thumbnail = models.ImageField(upload_to='thumbnails', blank=True)
    project_file = models.FileField(upload_to='projects')
    upload_date = models.DateTimeField(auto_now_add=True)


class Comment(models.Model):
    """ The comments Models """

    user = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='comments', on_delete=models.CASCADE)
    post = models.ForeignKey(Project, related_name='comments', on_delete=models.CASCADE)
    text = models.TextField(max_length=2048, blank=True)
    comment_date = models.DateTimeField(auto_now_add=True)
