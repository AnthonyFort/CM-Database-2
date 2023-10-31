from rest_framework.generics import ListCreateAPIView

# When an object is created with this view, it will be associated with the authenticated user who created it
class UserListCreateAPIView(ListCreateAPIView):
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)