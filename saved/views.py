from django.shortcuts import render
from rest_framework.generics import (
  GenericAPIView, RetrieveUpdateDestroyAPIView, UpdateAPIView
)
from lib.views import UserListCreateAPIView
from lib.permissions import IsOwner
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from music.models import MusicItem
from .models import SavedMusic
from .serializers.common import SavedMusicItemSerializer
  
class SavedMusicItemsView(UserListCreateAPIView):
  permission_classes = [IsAuthenticated, IsOwner]

  def get(self, request):
    saved_music = SavedMusic.objects.filter(user=request.user)
    serialized_saved_music = SavedMusicItemSerializer(saved_music, many=True)
    return Response(serialized_saved_music.data)
  
  def post(self, request):
    music_item_id = request.data.get('music_item')
    if not music_item_id:
        return Response({'error': 'music_item_id not provided in request body'})

    try:
        music_item = MusicItem.objects.get(id=music_item_id)
    except MusicItem.DoesNotExist:
        return Response({'error': 'Music item does not exist'})  

    if SavedMusic.objects.filter(user=request.user, music_item=music_item).exists():
        return Response({'error': 'Music item already saved'})
    
    SavedMusic.objects.create(user=request.user, music_item=music_item)

    return Response({'message': 'Music item saved'})