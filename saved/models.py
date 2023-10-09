from django.db import models
from music.models import MusicItem

class SavedMusic(models.Model):
    music_item = models.ForeignKey(MusicItem, on_delete=models.CASCADE)
    user = models.ForeignKey(
        'users.User',
        on_delete=models.CASCADE,
    )

