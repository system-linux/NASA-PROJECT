from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from .models import chatmessage,bPost,feedback

# Create your views here.
def main(request):
    return render(request, 'index.html')
def firePage(request):
    return render(request,'fire.html')
def imageryPage(request):
    return render(request,'imagery.html')
def eonetPage(request):
    return render(request,'eonet.html')
def archivePage(request):
    return render(request,'archive.html')
def settingsPage(request):
    return render(request,'settings.html')
def profilePage(request):
    if request.user.is_authenticated == False:
        return redirect("login")
    return render(request,'profile.html')

def loginPage(request):
    if request.method == "POST":
        username = request.POST['username']
        password = request.POST['password']
        user = authenticate(username=username, password=password)
        if user is not None:
            login(request, user)
            return redirect('/')
        else:
            return render(request, 'login.html', {
                "error": "Hatalı giriş!"
            })
    return render(request, 'login.html')

def registerPage(request):
    if request.method == "POST":
        username = request.POST['username']
        password = request.POST['password']
        country =  request.POST['country']
        email = request.POST['email']
        file = request.POST['file']
        country = request.POST['country']
        if User.objects.filter(username=username).exists():
            return render(request, 'kayit.html', {"error": "Bu username kullanılıyor!"})
        else:
            if User.objects.filter(email=email).exists():
                return render(request, 'kayit.html', {"error": "Bu e-mail kullanılıyor!"})
            else:
                user = User.objects.create_user(
                    username=username,email=email,first_name=username,last_name=country,password=password
                )
                user.save()
                return redirect("login")
    return render(request,'kayit.html')

def blogAddPage(request):
    if request.user.is_authenticated == False:
        return render(request, 'kayit.html')
    if request.method == "POST":
        blogheader = request.POST['title']
        blogusername = request.user.username
        blogemail = request.user.email
        blogicerik = request.POST['content']
        bPost.objects.create(header=blogheader,
                             username=blogusername,
                             email=blogemail,
                             text=blogicerik)
        return redirect("/blog/")
    return render(request, "blogadd.html")

def blog(request):
    val = {
        "blogs": bPost.objects.all().order_by("-date")
    }
    return render(request,"blog.html",val)

def settings(request):
    if request.user.is_authenticated == False:
        return render(request,"kayit.html")
    if request.method == "POST":
        feedbacktext= request.POST['feedback-input']
        feedback.objects.create(text=feedbacktext)
        return render(request,"settings.html")
    return render(request,"settings.html")

def chatPage(request):
    if request.user.is_authenticated == False:
        return render(request,'kayit.html')
    if request.method == "POST":
        senderName= request.user.username
        message= request.POST['userInput']
        chatmessage.objects.create(username=senderName,message=message)
    val={
        "messages": chatmessage.objects.all().order_by("-date")
    }
    return render(request,'chat.html',val)

def logoutPage(request):
    logout(request)
    return render(request,'kayit.html')