from .common import ServiceSerializer
from users.serializers.common import SimplifiedUserSerializer

class PopulatedServiceSerializer(ServiceSerializer):
  related_music = SimplifiedUserSerializer(many=True, required=False)
  
