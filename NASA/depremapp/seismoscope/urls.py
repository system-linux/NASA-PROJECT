from django.urls import path
from . import views

urlpatterns = [
    path('',views.main),
    path('/',views.main),
    path('fire/',views.firePage),
    path('eonet/',views.eonetPage),
    path('imagery/',views.imageryPage),
    path('archive/',views.archivePage),
    path('blog/',views.blog),
    path('settings/',views.settings),
    path('addblog/', views.blogAddPage),
    path('profile/',views.profilePage),
    path('settings/',views.settingsPage),
    path('chat/',views.chatPage,name="chat"),
    path('login/',views.loginPage,name="login"),
    path('signup/',views.registerPage,name="signup"),
    path('logout/',views.logoutPage,name="logout")
]