from rest_framework import serializers
from ..models import SavedMusic

class SavedMusicItemSerializer(serializers.ModelSerializer):
  class Meta:
    model = SavedMusic
    fields ='__all__'