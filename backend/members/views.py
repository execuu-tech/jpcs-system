from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import AllowAny

from .models import Members
from .serializers import MembersSerializer

class MemberViewSet(ModelViewSet):
    queryset = Members.objects.all().order_by("program", "lastName", "firstName", "middleName")
    serializer_class = MembersSerializer
    permission_classes = [AllowAny]