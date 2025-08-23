# helpers.py
from django.conf import settings
from .models import Members
from .schemas import MemberOut

def serialize_member(member: Members) -> MemberOut:
    """
    Returns a MemberOut object with full QR code URL (absolute).
    """
    member_out = MemberOut.from_orm(member)

    if member.qr_code:
        # If using Cloudinary, qr_code.url is already a full https:// URL
        qr_url = member.qr_code.url
        if not qr_url.startswith("http"):
            # Prepend your Render domain if it's a relative path
            qr_url = f"{settings.SITE_DOMAIN}{qr_url}"
        member_out.qr_code = qr_url

    return member_out
