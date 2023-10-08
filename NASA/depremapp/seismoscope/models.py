from django.db import models
#from django.contrib.auth.models import AbstractUser

# Create your models here.
"""class UserForm(models.Model):
    name= models.CharField(max_length=20)
    photography= models.ImageField()
    def __str__(self):
        return self.name"""
class feedback(models.Model):
    text= models.TextField()
    def __str__(self):
        return f"{self.text[:26]}"
class bPost(models.Model):
    header= models.CharField(max_length=60)
    username=models.CharField(max_length=20)
    email=models.TextField()
    date=models.DateTimeField(auto_now_add=True)
    text=models.TextField()
    def __str__(self):
        return f"{self.header}"
class chatmessage(models.Model):
    username= models.CharField(max_length=20)
    message= models.CharField(max_length=500)
    date= models.DateTimeField(auto_now_add=True)
    def __str__(self):
        return f"{self.username}"