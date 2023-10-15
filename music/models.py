from django.db import models

class MusicItem(models.Model):
    
    title = models.CharField(max_length=100)
    composer = models.CharField(max_length=50)
    related_readings = models.ManyToManyField(
        'readings.RelatedReading',
        related_name='related_music',
    )
    keywords = models.ManyToManyField(
        'keywords.Keyword',
        related_name='related_music',
    )
    user = models.ForeignKey(
        'users.User',
        related_name='music_items',
        on_delete=models.SET_NULL,
        null=True
    )


