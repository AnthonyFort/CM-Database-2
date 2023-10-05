from .common import RelatedReadingSerializer
from music.serializers.common import SimplifiedMusicItemSerializer

class PopulatedRelatedReadingSerializer(RelatedReadingSerializer):
  related_music = SimplifiedMusicItemSerializer(many=True)