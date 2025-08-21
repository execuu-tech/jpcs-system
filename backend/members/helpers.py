
# helpers.py (you can create this file inside your members app)
from .models import Members
from .schemas import MemberOut

def serialize_member(member: Members) -> MemberOut:
    """
    Returns a MemberOut object with full QR code URL.
    """
    member_out = MemberOut.from_orm(member)
    if member.qr_code:
        member_out.qr_code = f"http://localhost:8080{member.qr_code.url}"
    return member_out
