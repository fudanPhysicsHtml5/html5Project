from django import forms
from .models import Project, Comment


class UploadProjectForm(forms.ModelForm):
    """ Form for handling uploading of projects """

    class Meta:
        model = Project
        fields = ('title', 'thumbnail', 'upload_file')


class CommentForm(forms.Form):
    """ Form for adding comments"""

    text = forms.CharField(label="Comment", widget=forms.Textarea(attrs={'rows': 3}))

    def save(self, post, user):
        """ custom save method to create comment """

        comment = Comment.objects.create(text=self.cleaned_data.get('text', None), post=post, user=user)
