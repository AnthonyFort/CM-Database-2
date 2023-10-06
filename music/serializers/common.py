from rest_framework import serializers
from ..models import MusicItem
from keywords.serializers.common import KeywordSerializer
from keywords.models import Keyword
from readings.models import RelatedReading
from readings.serializers.common import RelatedReadingSerializer
from services.models import Service

class ServiceSerializerForMusic(serializers.ModelSerializer):
   class Meta:
      model = Service
      fields = ['id','date_of_service']

class MusicItemSerializer(serializers.ModelSerializer):
  keywords = KeywordSerializer(many=True)
  related_readings = RelatedReadingSerializer(many=True)
  performances = ServiceSerializerForMusic(many=True, read_only=True)
  class Meta:
    model = MusicItem
    fields = '__all__'

  def create(self, validated_data):  
    keywords_data = validated_data.pop('keywords')
    related_readings_data = validated_data.pop('related_readings')
    music_item = MusicItem.objects.create(**validated_data)

    for keyword_data in keywords_data:
      keyword, created = Keyword.objects.get_or_create(**keyword_data)
      music_item.keywords.add(keyword)

    for related_reading_data in related_readings_data:
      related_reading, created = RelatedReading.objects.get_or_create(**related_reading_data)
      music_item.related_readings.add(related_reading)

    return music_item   

class SimplifiedMusicItemSerializer(serializers.ModelSerializer):
  class Meta:
    model = MusicItem
    fields = ['id', 'title', 'composer' ]

  def create(self, validated_data):  
    keywords_data = validated_data.pop('keywords')
    related_readings_data = validated_data.pop('related_readings')
    music_item = MusicItem.objects.create(**validated_data)

    for keyword_data in keywords_data:
      keyword, created = Keyword.objects.get_or_create(**keyword_data)
      music_item.keywords.add(keyword)

    for related_reading_data in related_readings_data:
      related_reading, created = RelatedReading.objects.get_or_create(**related_reading_data)
      music_item.related_readings.add(related_reading)

    return music_item