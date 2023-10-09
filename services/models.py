from django.db import models
from datetime import date

# Create your models here.
class Service(models.Model):
    
    date_of_service = models.DateField(default=date.today)
    type_of_service = models.CharField(max_length=50, default='sunday service')
    user = models.ForeignKey(
        'users.User', 
        null=True, 
        on_delete=models.CASCADE, 
        related_name='past_services')
    music_items = models.ManyToManyField(
        'music.MusicItem',
        related_name='performances',
    )

    class Meta:
        unique_together = [['date_of_service', 'type_of_service', 'user']]

    def __str__(self):
        return f"{self.date_of_service} - {self.type_of_service}"