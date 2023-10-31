from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
  # Extends User model so that users must be affiliated with a church
  church = models.TextField(max_length=100, unique=True)
  

