from rest_framework.generics import CreateAPIView, GenericAPIView, RetrieveAPIView
from .serializers.common import RegistrationSerializer, UserSerializer
from django.contrib.auth import get_user_model
from lib.views import UserListCreateAPIView 
from rest_framework.permissions import IsAuthenticated
from lib.permissions import IsOwnerOrReadOnly
from rest_framework.response import Response

User = get_user_model()

class RegisterView(CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegistrationSerializer

class UserView(GenericAPIView):
  queryset=User.objects.all()
  serializer_class=UserSerializer

class UserListView(UserView, UserListCreateAPIView):
  permission_classes = [IsAuthenticated]    

class UserDetailView(UserView, RetrieveAPIView):
   permission_classes = [IsAuthenticated, IsOwnerOrReadOnly]
   lookup_field = 'id'

# This View allows the front end to retrieve the id of the current user
# This is used for authentication and for personalising the nav bar
class UserPersonalView(UserView, RetrieveAPIView):
  def get(self, request, *args, **kwargs):
     current_user = request.user   
     return Response({
        "id": current_user.id
     })