from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
  church = models.TextField(max_length=100, unique=True)
  

