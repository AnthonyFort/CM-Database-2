from django.shortcuts import render
from rest_framework.generics import (
  GenericAPIView, RetrieveUpdateDestroyAPIView
)
from lib.views import UserListCreateAPIView
from rest_framework.permissions import IsAuthenticated
from .models import MusicItem
from .serializers.common import MusicItemSerializer
from rest_framework.response import Response
from keywords.models import Keyword
from readings.models import RelatedReading
                 
class MusicItemView(GenericAPIView):
    queryset = MusicItem.objects.all()
    serializer_class = MusicItemSerializer

class MusicItemListView(MusicItemView, UserListCreateAPIView):
    permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data)
        return Response(serializer.errors, status=400)

class MusicItemDetailView(MusicItemView, RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAuthenticated]
