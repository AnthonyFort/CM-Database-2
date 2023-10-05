from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
  email = models.EmailField(unique=True)
  church = models.TextField(max_length=100, unique=True)
  

