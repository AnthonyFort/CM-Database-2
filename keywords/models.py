from django.db import models

class Keyword(models.Model):
  keyword = models.CharField(max_length=300)

def __str__(self):
  return self.keyword  
