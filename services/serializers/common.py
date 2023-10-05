from rest_framework import serializers
from ..models import Service
from users.models import User

class ServiceSerializer(serializers.ModelSerializer):

  user = serializers.PrimaryKeyRelatedField(read_only=True)
  class Meta:
    model = Service
    fields = '__all__'

  def create(self, validated_data):
    user = self.context['request'].user  
    service = Service.objects.create(**validated_data)
    return service