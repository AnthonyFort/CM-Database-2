from .views import MusicItemListView, MusicItemDetailView
from django.urls import path

urlpatterns = [
  path('', MusicItemListView()),
  path('<int:pk>', MusicItemDetailView())
]