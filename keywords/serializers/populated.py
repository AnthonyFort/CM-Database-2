from .common import KeywordSerializer
from music.serializers.common import MusicItemSerializer

class PopulatedKeywordSerializer(KeywordSerializer):
  related_music = MusicItemSerializer(many=True, required=False)
  
