from rest_framework.generics import ListCreateAPIView

class UserListCreateAPIView(ListCreateAPIView):
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)