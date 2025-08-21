from ninja import Schema
from typing import Optional
from datetime import datetime
from uuid import UUID
from pydantic import EmailStr
from django.conf import settings

class MemberIn(Schema):
    studentNumber: str
    firstName: str
    middleName: Optional[str] = None
    lastName: str
    yearLevel: int
    program: str
    isReg: str
    cspcEmail: EmailStr
    contactNumber: Optional[str] = None
    position: str
    foodRestriction: Optional[str] = None


class MemberOut(Schema):
    id: int
    studentNumber: str
    firstName: str
    middleName: Optional[str] = None
    lastName: str
    yearLevel: int
    program: str
    isReg: str
    cspcEmail: EmailStr
    contactNumber: Optional[str] = None
    position: str
    foodRestriction: Optional[str] = None
    created_at: datetime
    qr_token: UUID
    qr_code: Optional[str] = None
    temp_password: Optional[str] = None

    @classmethod
    def from_orm(cls, obj):
        data = super().from_orm(obj)
        if obj.qr_code:
            data.qr_code = f"http://localhost:8080{obj.qr_code.url}"
        return data
