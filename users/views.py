from rest_framework.generics import CreateAPIView, GenericAPIView
from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers.common import RegistrationSerializer, UserSerializer, SimplifiedUserSerializer
from django.contrib.auth import get_user_model
from lib.views import UserListCreateAPIView
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly


User = get_user_model()

class RegisterView(CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegistrationSerializer

class UserView(GenericAPIView):
  queryset=User.objects.all()
  serializer_class=UserSerializer

class UserListView(UserView, UserListCreateAPIView):
  permission_classes = [IsAuthenticated]    
  serializer_class = SimplifiedUserSerializer  

