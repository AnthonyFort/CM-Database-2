from django.shortcuts import render
from rest_framework.generics import (
  GenericAPIView, RetrieveUpdateDestroyAPIView
)
from rest_framework.permissions import IsAuthenticated

from lib.views import UserListCreateAPIView
from lib.permissions import IsOwnerOrReadOnly
from .models import Service
from .serializers.common import ServiceSerializer
from rest_framework.response import Response

class PastServiceView(GenericAPIView):
  queryset=Service.objects.all()
  serializer_class=ServiceSerializer

class PastServiceListView(PastServiceView, UserListCreateAPIView):
  permission_classes = [IsAuthenticated]
  
class PastServiceDetaillView(PastServiceView, RetrieveUpdateDestroyAPIView):
  permission_classes = [IsOwnerOrReadOnly]

  