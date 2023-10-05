from rest_framework import serializers
from ..models import RelatedReading

class RelatedReadingSerializer(serializers.ModelSerializer):
  class Meta:
    model = RelatedReading
    fields ='__all__'