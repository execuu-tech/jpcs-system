from django.db import models
from django.contrib.auth.models import User, Group
from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
import string, random, uuid, qrcode
from io import BytesIO
import cloudinary.uploader
from cloudinary.models import CloudinaryField


def generate_temp_password(length=8):
    return "".join(random.choices(string.ascii_letters + string.digits, k=length))


class Members(models.Model):
    PROGRAM_CHOICES = (
        ("BSCS", "BS in Computer Science"),
        ("BSIT", "BS in Information Technology"),
        ("BSIS", "BS in Information Systems"),
        ("BLIS", "BS in Library and Information Science"),
    )

    blockS = [(chr(i), chr(i)) for i in range(ord("A"), ord("Z") + 1)]

    POSITION_CHOICES = (
        ("Officer", "Officer"),
        ("Member", "Member"),
    )

    IS_REGULAR = (
        ("Regular", "Regular"),
        ("Irregular", "Irregular"),
    )

    studentNumber = models.CharField(max_length=20, unique=True, editable=True)
    firstName = models.CharField(max_length=50)
    middleName = models.CharField(max_length=50, blank=True)
    lastName = models.CharField(max_length=50)
    yearLevel = models.IntegerField(choices=[(i, str(i)) for i in range(1, 5)])
    program = models.CharField(max_length=4, choices=PROGRAM_CHOICES)
    block = models.CharField(
        max_length=1,
        choices=blockS,
        default=None,
        blank=True,
        editable=True,
        null=True,
    )
    isReg = models.CharField(
        max_length=9, choices=IS_REGULAR, default="Regular", editable=True
    )
    cspcEmail = models.EmailField(max_length=254, unique=True)
    contactNumber = models.CharField(max_length=11, blank=True)
    position = models.CharField(
        max_length=10, choices=POSITION_CHOICES, default="Member", editable=True
    )
    foodRestriction = models.CharField(max_length=50, blank=True, editable=True)
    created_at = models.DateTimeField(auto_now_add=True)
    qr_token = models.UUIDField(default=uuid.uuid4, unique=True, editable=False)
    qr_code = CloudinaryField("qr_code", blank=True, null=True)
    temp_password = models.CharField(max_length=128, blank=True, editable=False)

    user = models.OneToOneField(User, on_delete=models.CASCADE, null=True, blank=True)

    def _generate_qr(self):
        # Generate QR code as PNG in memory
        img = qrcode.make(str(self.qr_token))
        buffer = BytesIO()
        img.save(buffer, format="PNG")
        buffer.seek(0)

        # Upload directly to Cloudinary
        result = cloudinary.uploader.upload(
            buffer,
            folder="qr_codes",
            public_id=f"qr_{self.program} {self.yearLevel}{self.block}_{self.lastName}_{self.firstName}_{self.studentNumber}",
            overwrite=True,
            resource_type="image",
        )
        # Store the Cloudinary public_id in the field
        self.qr_code = result["public_id"]

    def save(self, *args, **kwargs):
        creating = self._state.adding
        if creating or not self.qr_code:
            self._generate_qr()
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.program} {self.yearLevel}{self.block} {self.lastName}, {self.firstName}, {self.middleName} ({self.studentNumber})"


# Signals
@receiver(post_save, sender=Members)
def sync_user_with_member(sender, instance, created, **kwargs):
    if created:
        temp_password = generate_temp_password()
        user = User.objects.create_user(
            username=instance.cspcEmail,
            email=instance.cspcEmail,
            password=temp_password,
            is_staff=False,
        )
        instance.temp_password = temp_password
        instance.user = user
        instance.save(update_fields=["temp_password", "user"])
    else:
        user = instance.user
        if user:
            if user.username != instance.cspcEmail or user.email != instance.cspcEmail:
                user.username = instance.cspcEmail
                user.email = instance.cspcEmail

            group_name = "OFFICERS" if instance.position == "Officer" else "MEMBERS"
            group, _ = Group.objects.get_or_create(name=group_name)
            user.groups.clear()
            user.groups.add(group)

            user.save()


@receiver(post_delete, sender=Members)
def delete_linked_user(sender, instance, **kwargs):
    if instance.user:
        instance.user.delete()
