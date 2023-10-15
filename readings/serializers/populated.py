from .common import RelatedReadingSerializer
from music.serializers.common import MusicItemSerializer

class PopulatedRelatedReadingSerializer(RelatedReadingSerializer):
  related_music = MusicItemSerializer(many=True)