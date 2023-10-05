from django.db import models

class MusicItem(models.Model):
    
    title = models.CharField(max_length=100)
    composer = models.CharField(max_length=50)
    related_readings = models.CharField(max_length=100)
    sheet_music_url = models.URLField()
    recording = models.URLField()
    past_performances = models.PositiveIntegerField(default=0)
    comments = models.CharField(max_length=200)
    # keywords = models.ManyToManyField(
    #     'keywords.Keyword',
    #     related_name='music',
    #     blank=True
    # )
    added_by = models.ForeignKey(
        'users.User',
        related_name='music',
        on_delete=models.SET_NULL,
        null=True
    )



    

