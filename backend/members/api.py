from ninja import Router
from django.shortcuts import get_object_or_404
from django.contrib.auth.models import User, Group
from .models import Members, generate_temp_password
from .schemas import MemberIn, MemberOut
from .helpers import serialize_member


router = Router(tags=["Members"])


def sync_user_and_group(member: Members):
    """
    Ensures that the Django User and Group stay in sync with Member.
    """
    if not member.user:
        # create user if missing
        temp_password = generate_temp_password()
        user = User.objects.create_user(
            username=member.cspcEmail,
            email=member.cspcEmail,
            password=temp_password,
            is_staff=False,
        )
        member.temp_password = temp_password
        member.user = user
        member.save(update_fields=["temp_password", "user"])
    else:
        # update email/username if changed
        user = member.user
        if user.username != member.cspcEmail or user.email != member.cspcEmail:
            user.username = member.cspcEmail
            user.email = member.cspcEmail

        user.save()

    # sync group
    group_name = "OFFICERS" if member.position == "Officer" else "MEMBERS"
    group, _ = Group.objects.get_or_create(name=group_name)
    member.user.groups.clear()
    member.user.groups.add(group)


@router.get("/", response=list[MemberOut])
def list_members(request):
    members = Members.objects.all()
    return [serialize_member(m) for m in members]

@router.get("/{member_id}", response=MemberOut)
def get_member(request, member_id: int):
    member = get_object_or_404(Members, id=member_id)
    return serialize_member(member)

@router.post("/", response=MemberOut)
def create_member(request, data: MemberIn):
    member = Members.objects.create(**data.dict())
    sync_user_and_group(member)
    return serialize_member(member)

@router.put("/{member_id}", response=MemberOut)
def update_member(request, member_id: int, data: MemberIn):
    member = get_object_or_404(Members, id=member_id)
    for attr, value in data.dict().items():
        setattr(member, attr, value)
    member.save()
    sync_user_and_group(member)
    return serialize_member(member)

@router.delete("/{member_id}")
def delete_member(request, member_id: int):
    member = get_object_or_404(Members, id=member_id)
    if member.user:
        member.user.delete()
    member.delete()
    return {"success": True}
