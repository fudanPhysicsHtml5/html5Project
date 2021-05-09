from django.shortcuts import render
from django.http import HttpResponse
import os
from django.template import loader
from physics.models import Project
from django.contrib import auth
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login, logout
from django.shortcuts import redirect
from django.urls import reverse
from functools import wraps
from django.http import Http404
import pathlib
from mysite.settings import MEDIA_ROOT, BASE_DIR
import shutil

g_upload_projects = True
g_manage_projects = False


def superuser_required(view_func):
    '''decorator used to authenticate the superuser'''
    @wraps(view_func)
    def _wrapper(request, *args, **kwargs):
        if (request.user.is_superuser):
            return view_func(request, *args, **kwargs)
        else:
            return redirect("admin_page:log_in")
    return _wrapper


@superuser_required
def manage_upload_projects(request):
    '''manage uploaded projects'''

    if (request.method == 'GET'):
        global g_upload_projects
        g_upload_projects = True
        global g_manage_projects
        g_manage_projects = False
        template = loader.get_template('admin.html')
        projects = Project.objects.filter(is_reviewed=False)
        context = {"Projects": projects, "upload_projects": g_upload_projects, "manage_projects": g_manage_projects}
        return render(request, 'admin.html', context)
    raise Http404()
    
    
@superuser_required
def manage_projects(request):
    '''manage launched projects'''

    if (request.method == 'GET'):
        global g_upload_projects
        g_upload_projects = False
        global g_manage_projects
        g_manage_projects = True
        template = loader.get_template('admin.html')
        projects = Project.objects.filter(is_reviewed = True)
        context = {"Projects": projects, "upload_projects": g_upload_projects, "manage_projects": g_manage_projects}
        return render(request, 'admin.html', context)
    raise Http404("no permission")
   
   
@superuser_required       
def add(request):
    '''launch a project'''

    if request.method == "GET":
        title = request.GET.get("title")
        project = Project.objects.get(title=title)
        project.is_reviewed = True
        project.save()
        return redirect("admin_page:upload_projects")
    raise Http404()


@superuser_required 
def delete(request):
    '''delete a project'''

    if request.method == "POST":
        title = request.POST["title"]
        project = Project.objects.get(title=title)
        os.remove(project.upload_file.path)
        path = project.index_path
        pj_dir = pathlib.PurePath(path).parent
        if pathlib.Path(pj_dir).is_dir():
           shutil.rmtree(pj_dir)

        project.delete()
        global g_manage_projects
        global g_upload_projects
        if g_upload_projects: 
            return redirect("admin_page:upload_projects")

        if g_manage_projects:
            return redirect("admin_page:manage_projects")
    raise Http404("project not found")


def log_in(request):
    '''login for admin'''

    if request.user.is_superuser:
        return redirect('admin_page:upload_projects')
    if request.method == "GET":
        return render(request, 'admin_login.html')
    if request.method == "POST":
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(username=username, password=password)
        if user and user.is_superuser:
            login(request, user)
            return redirect('/admin_page/upload_projects')
        else:
            raise Http404("login_failed")
        
        
@superuser_required
def log_out(request):
    '''logout for admin'''

    logout(request)
    return redirect("admin_page:log_in")
 
    