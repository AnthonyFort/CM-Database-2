from rest_framework import serializers
from ..models import SavedMusic
from music.serializers.common import MusicItemSerializer

class SavedMusicItemSerializer(serializers.ModelSerializer):

  music_item = MusicItemSerializer()
  past_performances = serializers.SerializerMethodField('get_past_performances')

  class Meta:
    model = SavedMusic
    fields = ('id', 'past_performances', 'music_item')

  def get_past_performances(self, obj):
    services = obj.music_item.performances.all()
    return [
        {
            'date_of_service': service.date_of_service,
            'type_of_service': service.type_of_service,
            'church': service.user.church
        }
        for service in services
    ]  