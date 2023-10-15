from rest_framework import serializers
from ..models import Service
from music.serializers.common import MusicItemSerializer

class ServiceSerializer(serializers.ModelSerializer):
    music_items = MusicItemSerializer(many=True)

    class Meta:
        model = Service
        fields = ('id', 'date_of_service', 'type_of_service', 'music_items')

    def create(self, validated_data):
        music_items_data = validated_data.pop('music_items', [])
        service = Service.objects.create(**validated_data)

        for music_item_data in music_items_data:
            music_item_serializer = MusicItemSerializer(data=music_item_data)
            if music_item_serializer.is_valid(raise_exception=True):
                music_item = music_item_serializer.save()
                service.music_items.add(music_item)

        return service

    def update(self, instance, validated_data):
        instance.date_of_service = validated_data.get('date_of_service', instance.date_of_service)
        instance.type_of_service = validated_data.get('type_of_service', instance.type_of_service)

        music_items_data = validated_data.pop('music_items', [])
        for music_item_data in music_items_data:
            music_item_serializer = MusicItemSerializer(data=music_item_data)
            if music_item_serializer.is_valid(raise_exception=True):
              music_item = music_item_serializer.save()
              instance.music_items.add(music_item)
        instance.save()
        return instance    


