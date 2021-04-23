from django import forms
from .models import Project


class UploadProjectForm(forms.ModelForm):
    """ Form for handling uploading of projects """

    class Meta:
        model = Project
        fields = ('title', 'thumbnail', 'upload_file')


