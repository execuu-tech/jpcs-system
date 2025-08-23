from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from .models import Event, Attendance
from .serializers import EventSerializer, AttendanceSerializer
from members.models import Members

class EventViewSet(viewsets.ModelViewSet):
    queryset = Event.objects.all()
    serializer_class = EventSerializer

class AttendanceViewSet(viewsets.ModelViewSet):
    queryset = Attendance.objects.all()
    serializer_class = AttendanceSerializer

    def list(self, request, *args, **kwargs):
        event_id = request.query_params.get("event_id")
        section = request.query_params.get("section")

        queryset = self.queryset
        if event_id:
            queryset = queryset.filter(event_id=event_id)
        if section in ['morning','afternoon','night']:
            queryset = queryset.filter(section=section)

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)
   
    @action(detail=False, methods=['post'])
    def scan(self, request):
        qr_token = request.data.get("qr_token")
        event_id = request.data.get("event_id")
        section = request.data.get("section")

        if not qr_token or not event_id or not section:
            return Response({"error": "qr_token, event_id, and section are required"},
                            status=status.HTTP_400_BAD_REQUEST)

        try:
            member = Members.objects.get(qr_token=qr_token)
        except Members.DoesNotExist:
            return Response({"error": "Invalid QR token"}, status=status.HTTP_404_NOT_FOUND)

        try:
            event = Event.objects.get(id=event_id)
        except Event.DoesNotExist:
            return Response({"error": "Event not found"}, status=status.HTTP_404_NOT_FOUND)

        if section not in ['morning','afternoon','night']:
            return Response({"error": "Invalid section"}, status=status.HTTP_400_BAD_REQUEST)
        if section == 'morning' and not event.has_morning:
            return Response({"error": "Event does not have a morning section"}, status=status.HTTP_400_BAD_REQUEST)
        if section == 'afternoon' and not event.has_afternoon:
            return Response({"error": "Event does not have an afternoon section"}, status=status.HTTP_400_BAD_REQUEST)
        if section == 'night' and not event.has_night:
            return Response({"error": "Event does not have a night section"}, status=status.HTTP_400_BAD_REQUEST)

        attendance, created = Attendance.objects.get_or_create(
            member=member,
            event=event,
            section=section,
            defaults={"status": "present"}
        )

        if not created:
            return Response({"message": "Already scanned", "attendance_id": attendance.id},
                        status=status.HTTP_200_OK)

        serializer = AttendanceSerializer(attendance)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
