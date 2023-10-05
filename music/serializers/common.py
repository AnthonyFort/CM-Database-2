from rest_framework import serializers
from ..models import MusicItem

class MusicItemSerializer(serializers.ModelSerializer):
  class Meta:
    model = MusicItem
    fields = '__all__'