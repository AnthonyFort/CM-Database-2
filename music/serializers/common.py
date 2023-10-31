from rest_framework import serializers
from ..models import MusicItem
from keywords.serializers.common import KeywordSerializer
from keywords.models import Keyword
from readings.models import RelatedReading
from readings.serializers.common import RelatedReadingSerializer
import requests

# Fetches bible text from 3rd-party API
def fetch_reading_text(book, chapter, start_verse, end_verse):
   api_text = requests.get(f"http://bible-api.com/{book} {chapter}:{start_verse}-{end_verse}")
   text = api_text.json().get('text')
   return text

def get_or_create_keywords(instance, keywords_data):
    for keyword_data in keywords_data:
        keyword, _ = Keyword.objects.get_or_create(**keyword_data)
        instance.keywords.add(keyword)

def get_or_create_related_readings(instance, readings_data):
    for reading_data in readings_data:
        reading_data['text'] = fetch_reading_text(
            reading_data['book'], 
            reading_data['chapter'],
            reading_data['start_verse'], 
            reading_data['end_verse']
        )
        related_reading, _ = RelatedReading.objects.get_or_create(**reading_data)
        instance.related_readings.add(related_reading)

class MusicItemSerializer(serializers.ModelSerializer):
    keywords = KeywordSerializer(many=True)
    related_readings = RelatedReadingSerializer(many=True)
    class Meta:
        model = MusicItem
        fields = ('id', 'title', 'composer', 'keywords', 'related_readings')

    # Shared functionality between create and update methods
    def handle_music_item(self, instance, validated_data):
        instance.title = validated_data.get('title', instance.title)
        instance.composer = validated_data.get('composer', instance.composer)
        instance.save()    
        get_or_create_keywords(instance, validated_data.pop('keywords', []))
        get_or_create_related_readings(instance, validated_data.pop('related_readings', []))
        return instance

    def create(self, validated_data):

        music_item, _ = MusicItem.objects.get_or_create(
            title=validated_data['title'],
            composer=validated_data['composer']
        )
        return self.handle_music_item(music_item, validated_data)

    def update (self, instance, validated_data):
          
        return self.handle_music_item(instance, validated_data)

        

