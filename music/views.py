from django.shortcuts import render
from rest_framework.generics import (
  GenericAPIView, RetrieveUpdateDestroyAPIView, UpdateAPIView
)
from lib.views import UserListCreateAPIView

from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly
from lib.permissions import IsOwnerOrReadOnly

from .models import MusicItem

from .serializers.common import MusicItemSerializer

from rest_framework.response import Response

import requests

from keywords.models import Keyword


class MusicItemView(GenericAPIView):
  queryset=MusicItem.objects.all()
  serializer_class=MusicItemSerializer

class MusicItemListView(MusicItemView, UserListCreateAPIView):
  permission_classes = [IsAuthenticated]  

  def create(self, request, *args, **kwargs):
        
        if request.method == 'POST':
  
          user_input = request.data.copy()
          related_readings = user_input.get('related_readings')
          for reading in related_readings:
              book = reading.get('book')
              chapter = reading.get('chapter')
              start_verse = reading.get('start_verse')
              end_verse = reading.get('end_verse')
              bible_api_url = f"http://bible-api.com/{book} {chapter}:{start_verse}-{end_verse}"
              retrieved_text = requests.get(bible_api_url)
              verse_text = retrieved_text.json().get('text')
              reading['text'] = verse_text
          
          request._full_data = user_input
          response = super(MusicItemListView, self).create(request, *args, **kwargs)       
          return response

     
    
           

class MusicItemDetailView(MusicItemView, RetrieveUpdateDestroyAPIView):
  permission_classes = [IsOwnerOrReadOnly]

  # def patch(self, request, *args, **kwargs):
  #   music_item = self.get_object()

  def patch(self, request, *args, **kwargs):
    if request.method == 'PATCH':
        music_item = self.get_object()

        keywords = request.data.get('keywords')
        
        for keyword_data in keywords:
            keyword = keyword_data.get('keyword')
            keyword, created = Keyword.objects.get_or_create(keyword=keyword)  
            music_item.keywords.add(keyword)

        music_item.save()
        print(music_item)
        serializer = self.get_serializer(music_item)
        return Response(serializer.data)