from rest_framework import serializers
from ..models import MusicItem
from keywords.serializers.common import KeywordSerializer
from keywords.models import Keyword
from readings.models import RelatedReading
from readings.serializers.common import RelatedReadingSerializer
from services.models import Service
from users.models import User
import requests

def fetch_reading_text(book, chapter, start_verse, end_verse):
   api_text = requests.get(f"http://bible-api.com/{book} {chapter}:{start_verse}-{end_verse}")
   text = api_text.json().get('text')
   return text

def update_or_create_keywords(instance, keywords_data):
    for keyword_data in keywords_data:
        keyword, _ = Keyword.objects.get_or_create(**keyword_data)
        instance.keywords.add(keyword)

def update_or_create_related_readings(instance, readings_data):
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

    def fetch_reading_text(self, reading):
        book = reading.get('book')
        chapter = reading.get('chapter')
        start_verse = reading.get('start_verse')
        end_verse = reading.get('end_verse')
        api_text = requests.get(f"http://bible-api.com/{book} {chapter}:{start_verse}-{end_verse}")
        text = api_text.json().get('text')
        return text

    def create(self, validated_data):
        keywords_data = validated_data.pop('keywords', [])
        related_readings_data = validated_data.pop('related_readings', [])

        music_item, created = MusicItem.objects.get_or_create(
            title=validated_data['title'],
            composer=validated_data['composer']
        )

        update_or_create_keywords(music_item, keywords_data)
        update_or_create_related_readings(music_item, related_readings_data)

        return music_item

    def update (self, instance, validated_data):
        instance.title = validated_data.get('title', instance.title)
        instance.composer = validated_data.get('composer', instance.composer) 

        keywords_data = validated_data.pop('keywords', [])
        instance.keywords.clear()
        for keyword_data in keywords_data:
            keyword, _ = Keyword.objects.get_or_create(**keyword_data)
            instance.keywords.add(keyword)

        related_readings_data = validated_data.pop('related_readings', [])
        instance.related_readings.clear()
        for reading_data in related_readings_data:
            reading_data['text'] = fetch_reading_text(
            reading_data['book'], 
            reading_data['chapter'],
            reading_data['start_verse'], 
            reading_data['end_verse']
        )
            reading, _ = RelatedReading.objects.get_or_create(**reading_data)
            instance.related_readings.add(reading)

        instance.save()    
        return instance

        

