from django.conf import settings
from .models import Members
from .schemas import MemberOut

def serialize_member(member: Members) -> MemberOut:
    """
    Returns a MemberOut object with full QR code URL (absolute).
    """
    # Convert qr_code to URL string before passing to Pydantic
    member_dict = {
        **{field: getattr(member, field) for field in MemberOut.__annotations__ if hasattr(member, field)},
        "qr_code": member.qr_code.url if member.qr_code else None,
    }
    return MemberOut(**member_dict)
