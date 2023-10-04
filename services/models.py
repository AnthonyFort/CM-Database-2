from django.db import models

# Create your models here.
class Service(models.Model):
    
    date_of_service = models.DateField()
    type_of_service = models.CharField(max_length=50)

    def __str__(self):
        return f"{self.date_of_service} - {self.type_of_service}"