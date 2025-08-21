from ninja import Schema
from typing import Optional
from datetime import date, datetime


# ----- Event Schemas -----
class EventIn(Schema):
    name: str
    date: date
    has_morning: bool = False
    has_afternoon: bool = False
    has_night: bool = False


class EventOut(Schema):
    id: int
    name: str
    date: date
    has_morning: bool
    has_afternoon: bool
    has_night: bool


# ----- Member Schema -----
class MemberOut(Schema):
    id: int
    firstName: str
    lastName: str
    cspcEmail: str


# ----- Attendance Schemas -----
class AttendanceIn(Schema):
    qr_token: str
    event_id: int
    section: str  # "morning" | "afternoon" | "night"
    status: Optional[str] = "present"


class AttendanceOut(Schema):
    id: int
    timestamp: datetime
    status: str
    section: str
    member: MemberOut
    event: EventOut
