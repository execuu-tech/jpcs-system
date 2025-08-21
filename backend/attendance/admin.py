from django.contrib import admin

# Register your models here.
from django.contrib import admin
from .models import Event, Attendance

@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    list_display = ("name", "date", "has_morning", "has_afternoon", "has_night")
    list_filter = ("date", "has_morning", "has_afternoon", "has_night")
    search_fields = ("name",)

@admin.register(Attendance)
class AttendanceAdmin(admin.ModelAdmin):
    list_display = ("member", "event", "section", "status", "timestamp")
    list_filter = ("event", "section", "status")
    search_fields = ("member__first_name", "member__last_name", "event__name")
