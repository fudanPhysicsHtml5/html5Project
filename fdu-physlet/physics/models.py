from django.db import models
from django.conf import settings


class Project(models.Model):
    """ The Project Models """

    user = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='projects', on_delete=models.CASCADE)
    title = models.CharField(max_length=128, blank=True)
    thumbnail = models.ImageField(upload_to='thumbnails', blank=True)
    upload_file = models.FileField(upload_to='projects/zipfiles')
    upload_date = models.DateTimeField(auto_now_add=True)
    is_reviewed = models.BooleanField(default=False)
    index_path = models.CharField(max_length=512)