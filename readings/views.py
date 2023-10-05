from django.shortcuts import render
from rest_framework.generics import ListCreateAPIView
from .models import RelatedReading
from .serializers.common import RelatedReadingSerializer
from .serializers.populated import PopulatedRelatedReadingSerializer

class ReadingListView(ListCreateAPIView):
  queryset = RelatedReading.objects.all()

  def get_serializer(self, *args, **kwargs):
    if self.request.method == 'POST':
      serializer_class = RelatedReadingSerializer
    else:
      serializer_class = PopulatedRelatedReadingSerializer
    return serializer_class(*args, **kwargs)
