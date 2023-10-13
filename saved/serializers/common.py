from rest_framework import serializers
from ..models import SavedMusic
from services.serializers.common import MusicItemSerializer

class SavedMusicItemSerializer(serializers.ModelSerializer):

  music_item = MusicItemSerializer()

  class Meta:
    model = SavedMusic
    fields ='__all__'