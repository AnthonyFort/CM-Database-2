from rest_framework import serializers
from ..models import Service
from music.serializers.common import MusicItemSerializer

class ServiceSerializer(serializers.ModelSerializer):
    # Establishes a relationship with MusicItem instances and services
    music_items = MusicItemSerializer(many=True)

    class Meta:
        model = Service
        fields = ('id', 'date_of_service', 'type_of_service', 'music_items')


    # Music_items is a many-to-many field - such fields cannot be populated until the object instance is created
    # Therefore we remove music_items, create a new service instance, and then put the music_items back
    def handle_music_items(self, instance, music_items_data):
        for music_item_data in music_items_data:
            music_item_serializer = MusicItemSerializer(data = music_item_data)
            if music_item_serializer.is_valid(raise_exception=True):
                music_item = music_item_serializer.save()
                instance.music_items.add(music_item)    

    def create(self, validated_data):
        
        music_items_data = validated_data.pop('music_items', [])
        service = Service.objects.create(**validated_data)
        self.handle_music_items(service, music_items_data)
        return service

    def update(self, instance, validated_data):
        instance.date_of_service = validated_data.get('date_of_service', instance.date_of_service)
        instance.type_of_service = validated_data.get('type_of_service', instance.type_of_service)

        music_items_data = validated_data.pop('music_items', [])
        self.handle_music_items(instance, music_items_data)
        instance.save()
        return instance    


