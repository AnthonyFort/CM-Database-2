from rest_framework import serializers
from ..models import MusicItem
from keywords.serializers.common import KeywordSerializer
from keywords.models import Keyword

class MusicItemSerializer(serializers.ModelSerializer):
  keywords = KeywordSerializer(many=True)
  class Meta:
    model = MusicItem
    fields = '__all__'

  def create(self, validated_data):  
    keywords_data = validated_data.pop('keywords')
    music_item = MusicItem.objects.create(**validated_data)

    for keyword_data in keywords_data:
      keyword, created = Keyword.objects.get_or_create(**keyword_data)
      music_item.keywords.add(keyword)

    return music_item    

class MusicItemSerializerForKeywords(serializers.ModelSerializer):
  class Meta:
    model = MusicItem
    fields = ['id', 'title', 'composer' ]

  def create(self, validated_data):  
    keywords_data = validated_data.pop('keywords')
    music_item = MusicItem.objects.create(**validated_data)

    for keyword_data in keywords_data:
      keyword, created = Keyword.objects.get_or_create(**keyword_data)
      music_item.keywords.add(keyword)

    return music_item  