from django.shortcuts import render
from rest_framework.generics import ListCreateAPIView
from .models import Keyword
from .serializers.common import KeywordSerializer
from .serializers.populated import PopulatedKeywordSerializer

class KeywordListView(ListCreateAPIView):
  queryset = Keyword.objects.all()

  def get_serializer(self, *args, **kwargs):
    if self.request.method == 'POST':
      serializer_class = KeywordSerializer
    else:
      serializer_class = PopulatedKeywordSerializer
    return serializer_class(*args, **kwargs)


