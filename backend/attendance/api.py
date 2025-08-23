# attendance/api.py
from typing import List, Optional
from ninja import Router
from ninja.errors import HttpError
from django.shortcuts import get_object_or_404
from .models import Event, Attendance
from members.models import Members
from .schemas import EventIn, EventOut, AttendanceIn, AttendanceOut

router = Router()

# --- Events ---

@router.get("/events", response=List[EventOut])
def list_events(request):
    """List all events"""
    return Event.objects.all()

@router.post("/events", response=EventOut)
def create_event(request, data: EventIn):
    """Create a new event"""
    return Event.objects.create(**data.dict())

@router.get("/events/{event_id}", response=EventOut)
def get_event(request, event_id: int):
    """Get a single event by ID"""
    return get_object_or_404(Event, id=event_id)

@router.delete("/events/{event_id}")
def delete_event(request, event_id: int):
    """Delete an event"""
    event = get_object_or_404(Event, id=event_id)
    event.delete()
    return {"success": True}

# --- Attendance ---

@router.get("/attendance", response=List[AttendanceOut])
def list_attendance(request):
    """List all attendance records"""
    return Attendance.objects.select_related("member", "event").all()

@router.get("/attendance/list", response=List[AttendanceOut])
def attendance_by_event_section(
    request,
    event_id: int,
    section: Optional[str] = None
):
    """Get attendance for a specific event and optional section"""
    qs = Attendance.objects.filter(event_id=event_id)
    if section:
        qs = qs.filter(section=section)
    return qs.select_related("member", "event")

@router.post("/attendance/scan", response=AttendanceOut)
def create_attendance(request, data: AttendanceIn):
    member = get_object_or_404(Members, qr_token=data.qr_token)
    event = get_object_or_404(Event, id=data.event_id)

    # prevent double scan
    existing = Attendance.objects.filter(member=member, event=event, section=data.section)
    if existing.exists():
        raise HttpError(400, "Already scanned")

    attendance = Attendance.objects.create(
        member=member,
        event=event,
        section=data.section,
        status=data.status or "present"
    )
    return attendance

@router.get("/attendance/{event_id}", response=List[AttendanceOut])
def event_attendance(request, event_id: int):
    """List attendance for a specific event"""
    return Attendance.objects.filter(event_id=event_id).select_related("member", "event")

@router.get("/member/{member_id}/events", response=List[dict])
def member_events(request, member_id: int):
    """
    Get all events attended by a specific member
    """
    member = get_object_or_404(Members, id=member_id)
    attendances = Attendance.objects.filter(member=member).select_related("event")
    
    events = [
        {
            "id": a.event.id,
            "name": a.event.name,
            "date": a.event.date,
            "section": a.section,
            "status": a.status,
        }
        for a in attendances
    ]
    return events
