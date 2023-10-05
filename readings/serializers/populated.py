from .common import RelatedReadingSerializer
from music.serializers.common import MusicItemSerializer

class PopulatedRelatedReadingSerializer(RelatedReadingSerializer):
  related_music_items = MusicItemSerializer(many=True)