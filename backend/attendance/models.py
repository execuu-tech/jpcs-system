from django.db import models
from members.models import Member

class Event(models.Model):
    name = models.CharField(max_length=200)
    date = models.DateField()

class Attendance(models.Model):
    member = models.ForeignKey(Member, on_delete=models.CASCADE)
    event = models.ForeignKey(Event, on_delete=models.CASCADE)
    timestamp = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=20, default='present')