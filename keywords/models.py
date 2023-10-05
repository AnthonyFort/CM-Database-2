from django.db import models

class Keyword(models.Model):
  keyword = models.CharField(max_length=300)
  related_music_items = models.ManyToManyField(
        'music.MusicItem',
        related_name='related_keywords',
    )

def __str__(self):
  return self.keyword  
