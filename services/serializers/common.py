from rest_framework import serializers
from ..models import Service
from users.models import User
from music.serializers.common import MusicItemSerializer
from music.models import MusicItem
from keywords.models import Keyword
from readings.models import RelatedReading

class MusicItemSerializerForService(serializers.ModelSerializer):
   class Meta:
      model = MusicItem
      fields = ['id', 'title', 'composer']

class ServiceSerializer(serializers.ModelSerializer):

  music_items = MusicItemSerializer(many=True)

  class Meta:
        model = Service
        fields = ('date_of_service', 'type_of_service', 'music_items')

  def create(self, validated_data):
        music_items_data = validated_data.pop('music_items', [])
        service = Service.objects.create(**validated_data)

        for music_item_data in music_items_data:
            keywords_data = music_item_data.pop('keywords', [])
            related_readings_data = music_item_data.pop('related_readings', [])

            music_item, created = MusicItem.objects.get_or_create(
                title=music_item_data['title'], composer=music_item_data['composer']
            )

            if not created:
                for keyword_data in keywords_data:
                    keyword, _ = Keyword.objects.get_or_create(**keyword_data)
                    music_item.keywords.add(keyword)

                for related_reading_data in related_readings_data:
                    related_reading, _ = RelatedReading.objects.get_or_create(**related_reading_data)
                    music_item.related_readings.add(related_reading)
            else:
                music_item.keywords.set([
                    Keyword.objects.get_or_create(**keyword_data)[0]
                    for keyword_data in keywords_data
                ])
                music_item.related_readings.set([
                    RelatedReading.objects.get_or_create(**related_reading_data)[0]
                    for related_reading_data in related_readings_data
                ])

            service.music_items.add(music_item)

        return service

  
class ServiceSerializerForChurch(serializers.ModelSerializer):
  music_items = MusicItemSerializerForService(many=True)


  class Meta:
    model = Service
    fields = ['music_items', 'date_of_service', 'type_of_service']

  def create(self, validated_data):
   
    music_items_data = validated_data.pop('music_items')
    service = Service.objects.create(**validated_data)
    for music_item in music_items_data:
        service.music_items.add(music_item)

    return service
  

 