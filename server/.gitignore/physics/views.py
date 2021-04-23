from django.contrib.auth.decorators import login_required
from django.shortcuts import render
from django.http import HttpResponse
import os
import pathlib
import zipfile
from django.template import loader
from .models import Project
from django.contrib import auth
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login, logout
from django.shortcuts import redirect
import zipfile
from .forms import UploadProjectForm, CommentForm
from .models import Project
from mysite.settings import MEDIA_ROOT, MEDIA_URL
projectPath = os.path.join(os.path.dirname(os.path.dirname(__file__)), "projectFile")
        
        

def index(request):
    projects = Project.objects.filter(is_reviewed = True)
    pjs = list(projects)
    return render(request, 'index/index.html', {'projects': projects})


def download(request):
    if request.method=='GET':
        first = request.GET.get("first")
        second = request.GET.get("second")
        print('first = {} second = {}'.format(first, second))
        path = os.path.dirname(os.path.dirname(__file__))
        file_path = os.path.join(path, "statics\\download_test.html")
        file = open(file_path, "rb")
        response = HttpResponse(file)
        response['content_type'] = 'application/octet-stream'
        response['Content-Disposition'] ='attachment;filename="models.html"'
        return response


@login_required
def upload(request):
    """ create a new posts to user """
    # handle only POSTed Data
    if request.method == 'POST':
        form = UploadProjectForm(request.POST, request.FILES)
        # validate form based on form definition
        if form.is_valid():
            project = form.save(commit=False)
            project.user = request.user
            pj_dir = os.path.join(MEDIA_ROOT, "projects", request.user.username, form.cleaned_data['title'])
            project.save()
            pathlib.Path(pj_dir).mkdir(parents=True, exist_ok=True)
            print(project.upload_file.path)
            zip_path = os.path.join(MEDIA_ROOT, project.upload_file.path)
            project.index_path = os.path.join(MEDIA_URL, 'projects', request.user.username,
                                              form.cleaned_data['title'], 'index.html')
            project.save()
            with zipfile.ZipFile(zip_path) as f:
                f.extractall(pj_dir)
            return redirect('physics:index')
    else:
        form = UploadProjectForm()
    return render(request, 'upload/upload.html', {'form': form})