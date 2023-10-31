from rest_framework.permissions import BasePermission, SAFE_METHODS

# When used, it will provide special permissions to the owner and read-only permissions to anyone else
class IsOwnerOrReadOnly(BasePermission):
  def has_object_permission(self, request, view, obj):
    if request.method in SAFE_METHODS:
      return True
    return obj.user == request.user
  
# When used, only the owner can access this information  
class IsOwner(BasePermission):
  def has_object_permission(self, request, view, obj):
    return obj.user == request.user 