from django.db import models

class MusicItem(models.Model):
    
    title = models.CharField(max_length=100)
    composer = models.CharField(max_length=50)
    related_readings = models.CharField(max_length=100)
    sheet_music_url = models.URLField(blank=True, null=True)
    recording = models.URLField(blank=True, null=True)
    past_performances = models.PositiveIntegerField(default=0)
    comments = models.CharField(max_length=200, blank=True, null=True)
    keywords = models.ManyToManyField(
        'keywords.Keyword',
        related_name='music',
    )
    user = models.ForeignKey(
        'users.User',
        related_name='music_items',
        on_delete=models.SET_NULL,
        null=True
    )



    

