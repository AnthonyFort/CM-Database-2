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

class MusicItemView(GenericAPIView):
  queryset=MusicItem.objects.all()
  serializer_class=MusicItemSerializer

class MusicItemListView(MusicItemView, UserListCreateAPIView):
  permission_classes = [IsAuthenticated]  

class MusicItemDetailView(MusicItemView, RetrieveUpdateDestroyAPIView):
  permission_classes = [IsOwnerOrReadOnly]

  def patch(self, request, *args, **kwargs):
    music_item = self.get_object()