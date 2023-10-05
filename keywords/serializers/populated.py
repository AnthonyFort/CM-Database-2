from .common import KeywordSerializer
from music.serializers.common import MusicItemSerializerForKeywords

class PopulatedKeywordSerializer(KeywordSerializer):
  music = MusicItemSerializerForKeywords(many=True, required=False)
  
