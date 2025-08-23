from django.db import models
from members.models import Members

class Event(models.Model):
    name = models.CharField(max_length=200)
    date = models.DateField()
    has_morning = models.BooleanField(default=False)
    has_afternoon = models.BooleanField(default=False)
    has_night = models.BooleanField(default=False)


    def __str__(self):
        return f"{self.name} ({self.date})"

class Attendance(models.Model):
    member = models.ForeignKey(Members, on_delete=models.CASCADE)
    event = models.ForeignKey(Event, on_delete=models.CASCADE)
    timestamp = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=20, default='present')
    section = models.CharField(max_length=20, choices=[('morning','Morning'),('afternoon','Afternoon'),('night','Night')])

    class Meta:
        unique_together = ('member', 'event', 'section')

    def __str__(self):
        return f"{self.member} - {self.event} ({self.section})"
