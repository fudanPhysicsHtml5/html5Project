from django.shortcuts import render
from django.http import HttpResponse
import os
from django.template import loader
from physics.models import Projects, UploadProjects
from django.contrib import auth
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login, logout
from django.shortcuts import redirect
import zipfile

projectPath = os.path.join(os.path.dirname(os.path.dirname(__file__)), "projectFile")

def index(request):
    #if request.user.is_authenticated:
        #return HttpResponse("is authenticated")
    #else:
        #return HttpResponse("has not logged in")
    template = loader.get_template('index.html')
    projects = Projects.objects.all()
    context = {"Projects": projects}
    return render(request, 'index.html', context)
    

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


def upload(request):
    response = HttpResponse()
    response['Access-Control-Allow-Origin'] = '*'
    # receive uploadFile
    if request.method == "POST":
        # get name and determine if the name is created
        projectName = request.POST.get("name")
        #list = Projects.objects.filter(name=request[name])
        fileDir = os.path.join(projectPath, projectName)
        if (not os.path.exists(fileDir)):
            os.mkdir(fileDir)
        file = request.FILES.get("file")
        filePath = os.path.join(fileDir, file.name)
        uploadProjects = UploadProjects(name=projectName, path=filePath)
        uploadProjects.save()
        with open(filePath, "wb") as fd:
            for i in file:
                fd.write(i)
        response.content="上传成功"

        # unarchive
        zip_file = zipfile.ZipFile(filePath)
        print(filePath)
        zip_list = zip_file.namelist()
        for f in zip_list:
            zip_file.extract(f, fileDir)
        return response
    response.content="上传失败"
    return response


def log_in(request):
    if request.method == "GET":
        return
    if request.method == "POST":
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(username=username, password=password)
        if user is not None:
            login(request, user)
            return HttpResponse("successfully logged in")
        else:
            return HttpResponse("login failed, you entered a wrong username or password")
        
        
def sign_up(request):
    if request.method == "POST":
        username = request.POST.get("username")
        # if user_name_exists;
        user_list = User.objects.filter(username = username)
        if len(user_list) > 0:
            return HttpResponse("the username has been signed, please choose another username")
        password = request.POST.get("password")
        User.objects.create_user(username=username, password=password)
        return redirect("/physics")


def change_password(request):
    if request.method == "POST":
        username = request.POST.get("username")
        new_password = request.POST.get("new_password")
        user = User.objects.get(username=username)
        user.set_password(new_password)
        user.save()
        
        #login(request, user): 
        return HttpResponse("successfully change the password")
    else:
        return HttpResponse("reseting password failed")


def log_out(request):
    logout(request)
    return redirect("/physics/")

# admin html
#def add(request):
    