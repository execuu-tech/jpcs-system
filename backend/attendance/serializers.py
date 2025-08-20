from rest_framework import serializers
from .models import Event, Attendance
from members.serializers import MembersSerializer

class EventSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = '__all__'
        date = serializers.DateField(format="%m/%d/%Y")

class AttendanceSerializer(serializers.ModelSerializer):
    member = MembersSerializer(read_only=True) 
    event = EventSerializer(read_only=True)

    class Meta:
        model = Attendance
        fields = '__all__'
        read_only_fields = ('timestamp',)
