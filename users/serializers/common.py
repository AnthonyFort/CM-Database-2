from rest_framework import serializers
from django.contrib.auth import get_user_model

from services.models import Service
from services.serializers.common import ServiceSerializer

# Each user is uniquely connected to a church
# Therefore each "user" is also a particular church - "user" and "church" are interchangeable

User = get_user_model()

class RegistrationSerializer(serializers.ModelSerializer):

    # These fields will not be serialized when user information is retrieved later
    password = serializers.CharField(write_only=True)
    password_confirmation = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ('id', 'username', 'password', 'password_confirmation', 'church')

    # This functions checks to see that the password and password_confirmation match
    # It pops the password_confirmation because this field no longer needs to be stored
    def validate(self, data):
        password = data.get('password')
        password_confirmation = data.pop('password_confirmation')

        if password != password_confirmation:
            raise serializers.ValidationError('Passwords do not match.')
        
        return data
    
    # Uses django's built-in create_user method and DRF's validated_data
    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user
    
class UserSerializer(serializers.ModelSerializer):
    # Establishes a related field that is constructed through the ServiceSerializer
    past_services = ServiceSerializer(many=True, read_only=True)
    class Meta:
        model = User
        fields = ('id', 'username', 'church', 'past_services')


