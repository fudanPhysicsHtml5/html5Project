from django.contrib.auth.decorators import login_required
from django.shortcuts import render, get_object_or_404
from django.http import HttpResponse, FileResponse
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
from .forms import UploadProjectForm
from .models import Project
from mysite.settings import MEDIA_ROOT, MEDIA_URL
projectPath = os.path.join(os.path.dirname(os.path.dirname(__file__)), "projectFile")
        
        

def index(request):
    projects = Project.objects.all()
    pjs = list(projects)
    return render(request, 'index/index.html', {'projects': projects})


def download(request, id):
    project = get_object_or_404(Project, id=id)
    file_name = project.title+".zip"
    if request.method=='GET':
        file_path = project.upload_file.path
        file = open(project.upload_file.path, "rb")
        response = FileResponse(file)
        response['Content-Disposition'] = 'attachment; filename='+file_name
        response['content_type'] = 'application/zip'
        return response
    else:
        return HttpResponse("only accept GET request")


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