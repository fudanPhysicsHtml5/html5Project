from django.db import models
from django.conf import settings
from django.core.exceptions import ValidationError

def validate_file_extension(value):
    if not value.name.endswith('.zip'):
        raise ValidationError(u'Please Upload Zip Files!')


class Project(models.Model):
    """ The Project Models """

    user = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='projects', on_delete=models.CASCADE)
    title = models.CharField(max_length=128, blank=True)
    thumbnail = models.ImageField(upload_to='thumbnails', blank=True)
    upload_file = models.FileField(upload_to='projects/zipfiles', validators=[validate_file_extension])
    upload_date = models.DateTimeField(auto_now_add=True)
    is_reviewed = models.BooleanField(default=False)
    index_path = models.CharField(max_length=512)