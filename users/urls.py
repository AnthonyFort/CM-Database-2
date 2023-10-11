from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import RegisterView, UserListView, UserDetailView, UserPersonalView
from django.contrib.auth.views import LogoutView

urlpatterns = [
    path('', UserListView.as_view()),
    path('login/', TokenObtainPairView.as_view()),
    path('register/', RegisterView.as_view()),
    path('refresh/', TokenRefreshView.as_view()),
    path('logout/', LogoutView.as_view()),
    path('<int:id>/', UserDetailView.as_view()),
    path('current/', UserPersonalView.as_view())
]