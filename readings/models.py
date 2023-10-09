from django.db import models

class RelatedReading(models.Model):
  book = models.CharField()
  chapter = models.PositiveIntegerField()
  start_verse = models.PositiveIntegerField()
  end_verse = models.PositiveIntegerField()
  text = models.CharField(blank=True, null=True)

  class Meta:
        unique_together = ('book', 'chapter', 'start_verse', 'end_verse')

  def __str__(self):
    return f"{self.book} {self.chapter}: {self.start_verse}-{self.end_verse}"
