from django.shortcuts import render
from rest_framework.generics import ListCreateAPIView
from .models import Keyword
from .serializers.common import KeywordSerializer
from .serializers.populated import PopulatedKeywordSerializer

class KeywordListView(ListCreateAPIView):
  queryset = Keyword.objects.all()

  def get_serializer(self):
    if self.request.method == 'POST':
      return KeywordSerializer
    return PopulatedKeywordSerializer


