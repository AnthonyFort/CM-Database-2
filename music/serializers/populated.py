from rest_framework import serializers
from ..models import MusicItem
from .common import MusicItemSerializer

class PopulatedMusicItemSerializer(MusicItemSerializer):
  past_performances = serializers.SerializerMethodField('get_past_performances')

  class Meta:
    model = MusicItem
    fields = ('id', 'title', 'composer', 'keywords', 'related_readings', 'past_performances')

  def get_past_performances(self, obj):
    services = obj.performances.all()
    return [
      {
          'date_of_service': service.date_of_service,
          'type_of_service': service.type_of_service,
          'church': service.user.church
      }
      for service in services
  ]  
