from ninja import Schema
from typing import Optional
from datetime import date, datetime
from pydantic import EmailStr


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
    studentNumber: str
    firstName: str
    middleName: str
    lastName: str
    program: str
    block: str
    yearLevel: int
    cspcEmail: EmailStr


# ----- Attendance Schemas -----
class AttendanceIn(Schema):
    qr_token: str
    event_id: int
    section: str
    status: Optional[str] = "present"


class AttendanceOut(Schema):
    id: int
    timestamp: datetime
    status: str
    section: str
    member: MemberOut
    event: EventOut
