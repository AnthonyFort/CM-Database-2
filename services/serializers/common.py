from rest_framework import serializers
from ..models import Service
from users.models import User
from music.serializers.common import MusicItemSerializer
from music.models import MusicItem

class MusicItemSerializerForService(serializers.ModelSerializer):
   class Meta:
      model = MusicItem
      fields = ['id', 'title', 'composer']

class ServiceSerializer(serializers.ModelSerializer):
  music_items = MusicItemSerializerForService(many=True)

  user = serializers.PrimaryKeyRelatedField(read_only=True)
  class Meta:
    model = Service
    fields = '__all__'

  def create(self, validated_data):
    user = self.context['request'].user  
    music_items_data = validated_data.pop('music_items')
    service = Service.objects.create(**validated_data)
    for music_item in music_items_data:
        service.music_items.add(music_item)

    return service
  

 