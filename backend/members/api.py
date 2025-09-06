from ninja import Router, File
from ninja.files import UploadedFile
from django.db import transaction
from django.shortcuts import get_object_or_404
from django.contrib.auth.models import User, Group
from django.contrib.auth.hashers import check_password
from .models import Members, generate_temp_password
from .schemas import MemberIn, MemberOut, PasswordChangeIn, PasswordChangeResponse
from .helpers import serialize_member

import csv
from io import TextIOWrapper

from ninja_jwt.authentication import JWTAuth
import helpers

router = Router(tags=["Members"])


@router.get("/", response=list[MemberOut], auth=helpers.api_auth_user_or_annon)
def list_members(request):
    members = Members.objects.all()
    return [serialize_member(m) for m in members]


@router.post("/import-mem-csv")
def import_mem_csv(request, file: UploadedFile = File(...)):
    """
    Import members via .csv file.
    """

    text_file = TextIOWrapper(file.file, encoding="utf-8")
    reader = csv.DictReader(text_file)

    created, updated, errors = 0, 0, []

    with transaction.atomic():
        for i, row in enumerate(reader, start=1):
            try:
                # ensure required fields exist
                if not row.get("studentNumber") or not row.get("cspcEmail"):
                    errors.append(f"Row {i}: Missing studentNumber or cspcEmail")
                    continue

                # update or create
                member, created_flag = Members.objects.update_or_create(
                    studentNumber=row["studentNumber"],
                    defaults={
                        "firstName": row.get("firstName", ""),
                        "middleName": row.get("middleName", ""),
                        "lastName": row.get("lastName", ""),
                        "yearLevel": row.get("yearLevel", ""),
                        "program": row.get("program", ""),
                        "block": row.get("section", ""),
                        "isReg": row.get("isReg", ""),
                        "cspcEmail": row.get("cspcEmail", ""),
                        "contactNumber": row.get("contactNumber", ""),
                        "position": row.get("position", ""),
                        "foodRestriction": row.get("foodRestriction", ""),
                    },
                )
                sync_user_and_group(member)

                if created_flag:
                    created += 1
                else:
                    updated += 1

            except Exception as e:
                errors.append(f"Row {i}: {str(e)}")

    return {
        "created": created,
        "updated": updated,
        "errors": errors,
    }


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
        user = member.user
        if user.username != member.cspcEmail or user.email != member.cspcEmail:
            user.username = member.cspcEmail
            user.email = member.cspcEmail

        user.save()

    group_name = "OFFICERS" if member.position == "Officer" else "MEMBERS"
    group, _ = Group.objects.get_or_create(name=group_name)
    member.user.groups.clear()
    member.user.groups.add(group)


@router.post(
    "/change-password",
    response={
        200: PasswordChangeResponse,
        400: PasswordChangeResponse,
        401: PasswordChangeResponse,
    },
    auth=JWTAuth(),
)
def change_password(request, data: PasswordChangeIn):
    user: User = request.user

    if not user.is_authenticated:
        return 401, {"message": "Authentication required"}

    if not check_password(data.old_password, user.password):
        return 400, {"message": "Old password is incorrect"}

    user.set_password(data.new_password)
    user.save()

    return 200, {"message": "Password updated successfully"}


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

    if hasattr(member, "user") and member.user:
        try:
            member.user.delete()
        except User.DoesNotExist:
            pass

    member.delete()
    return {"success": True}
