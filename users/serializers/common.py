from rest_framework import serializers
from django.contrib.auth import get_user_model

from services.models import Service
from services.serializers.common import ServiceSerializer

User = get_user_model()

class RegistrationSerializer(serializers.ModelSerializer):

    password = serializers.CharField(write_only=True)
    password_confirmation = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'password', 'password_confirmation', 'church')

    def validate(self, data):
        password = data.get('password')
        password_confirmation = data.pop('password_confirmation')

        if password != password_confirmation:
            raise serializers.ValidationError('Passwords do not match.')
        
        return data
    
    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user
    
class UserSerializer(serializers.ModelSerializer):
    past_services = ServiceSerializer(many=True, read_only=True)
    class Meta:
        model = User
        fields = ('id', 'username', 'church', 'past_services')

    def create(self, validated_data):  
      past_services_data = validated_data.pop('past_services')
      user = User.objects.create(**validated_data)

      for past_service_data in past_services_data:
        past_service, created = Service.objects.get_or_create(**past_service_data)
        user.past_services.add(past_service)

      return user    


