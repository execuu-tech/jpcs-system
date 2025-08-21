from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from members.models import Members
from .views import ChangePasswordView

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def me(request):
    member = Members.objects.filter(cspcEmail=request.user.email).first()
    
    return Response({
        "username": request.user.username,
        "email": request.user.email,
        "position": member.position if member else None,
        "groups": list(request.user.groups.values_list('name', flat=True)),
    })

urlpatterns = [
    path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('me/', me, name='me'),
    path('change-password/', ChangePasswordView.as_view(), name="change_password"),
]
