from .views import PastServiceListView, PastServiceDetaillView
from django.urls import path

urlpatterns = [
  path('', PastServiceListView.as_view()),
  path('<int:pk>', PastServiceDetaillView.as_view())
]