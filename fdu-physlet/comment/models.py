from django.db import models
from django.contrib.auth.models import User
from ckeditor.fields import RichTextField
from mptt.models import MPTTModel, TreeForeignKey
from physics.models import Project
from django.conf import settings

# comment for the project
class Comment(MPTTModel):
    project = models.ForeignKey(
        Project,
        on_delete = models.CASCADE,
        related_name='comments'
    )

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='comments'
    )

    # model for MPTT
    parent = TreeForeignKey(
        'self',
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='children'
    )

    reply_to = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='repliers' 
    )

    body = RichTextField()
    created = models.DateTimeField(auto_now_add=True)

    class MPTTMEta:
        order_insertion_by = ['created']

    def __str__(self):
        return self.body[:20]