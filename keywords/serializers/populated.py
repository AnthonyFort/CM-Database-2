from .common import KeywordSerializer
from music.serializers.common import SimplifiedMusicItemSerializer

class PopulatedKeywordSerializer(KeywordSerializer):
  related_music = SimplifiedMusicItemSerializer(many=True, required=False)
  
