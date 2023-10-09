from .views import SavedMusicItemsView
from django.urls import path

urlpatterns = [
  path('', SavedMusicItemsView.as_view()),
  path('<int:pk>/', SavedMusicItemsView.as_view())
]