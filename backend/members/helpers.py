# helpers.py
from .models import Members
from .schemas import MemberOut

def serialize_member(member: Members) -> MemberOut:
    """
    Returns a MemberOut object with full QR code URL (Cloudinary or storage backend).
    """
    member_out = MemberOut.from_orm(member)
    if member.qr_code:
        member_out.qr_code = member.qr_code.url  
    return member_out
