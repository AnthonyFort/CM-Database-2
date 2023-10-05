from .views import MusicItemListView, MusicItemDetailView
from django.urls import path

urlpatterns = [
  path('', MusicItemListView.as_view()),
  path('<int:pk>', MusicItemDetailView.as_view())
]