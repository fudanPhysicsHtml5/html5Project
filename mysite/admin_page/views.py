from django.shortcuts import render
from django.http import HttpResponse
import os
from django.template import loader
from physics.models import Projects
from django.contrib import auth
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login, logout
from django.shortcuts import redirect
from django.urls import reverse
from functools import wraps
from django.http import Http404

upload_projects = True
manage_projects = False
url_path = "http://127.0.0.1:8000/admin_page"


def superuser_required(view_func):
    @wraps(view_func)
    def _wrapper(request, *args, **kwargs):
        if (request.user.is_superuser):
            return view_func(request, *args, **kwargs)
        else:
            raise Http404("no superuser permission")
    return _wrapper


@superuser_required
def manage_upload_projects(request):
    '''manage uploaded projects'''

    if (request.method == 'GET'):
        upload_projects = True
        manage_projects = False
        template = loader.get_template('admin.html')
        projects = Projects.objects.filter(status=False)
        for project in projects:
            print(project.name)
            print("\n")
        context = {"Projects": projects, "upload_projects": upload_projects, "manage_projects": manage_projects, "url_path": url_path}
        return render(request, 'admin.html', context)
    return Http404()
    
    
@superuser_required
def manage_projects(request):
    '''manage launched projects'''

    if (request.method == 'GET'):
        upload_projects = False
        manage_projects = True
        template = loader.get_template('admin.html')
        projects = Projects.objects.filter(status = True)
        context = {"Projects": projects, "upload_projects": upload_projects, "manage_projects": manage_projects, "url_path": url_path}
        return render(request, 'admin.html', context)
    return HttpResponse("no permission")
   
   
@superuser_required       
def add(request):
    '''launch a project'''

    if request.method == "GET":
        name = request.GET.get("name")
        project = Projects.objects.get(name=name)
        project.status = True
        project.save()
        return redirect("/admin_page")
    return Http404()


@superuser_required 
def delete(request):
    '''delete a project'''

    if request.method == "POST":
        name = request.GET.get("name")
        project = Projects.objects.get(name=name)
        project.delete()
        if manage_projects:
            return redirect("/admin_page/manage_projects")
        if upload_projects:
            return redirect("/admin_page")
    return Http404()


def log_in(request):
    '''login for admin'''

    if request.user.is_superuser:
        return redirect('/admin_page/upload_projects')
    if request.method == "GET":
        return render(request, 'admin_login.html')
    if request.method == "POST":
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(username=username, password=password)
        if user and user.is_superuser:
            login(request, user)
            return redirect('/admin_page/upload_projects')
            #return render(request, 'admin_login.html')
        else:
            return Http404("login_failed")
        
        
@superuser_required
def log_out(request):
    '''logout for admin'''

    logout(request)
    return redirect("/admin_page/log_in")
 
    