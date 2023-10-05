from django.urls import path
from .views import KeywordListView

urlpatterns = [
  path('', KeywordListView.as_view())
]