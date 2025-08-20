from django.db import models
from io import BytesIO
from django.core.files import File

import qrcode
import uuid


class Members(models.Model):

    PROGRAM_CHOICES = (
        ("BSCS", "BS in Computer Science"),
        ("BSIT", "BS in Information Technology"),
        ("BSIS", "BS in Information Systems"),
    )

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
    isReg = models.CharField(max_length=9, choices=IS_REGULAR, default="Regular", editable=True)
    cspcEmail = models.EmailField(max_length=254, unique=True)
    contactNumber = models.CharField(max_length=15, blank=True)
    position = models.CharField(max_length=10, choices=POSITION_CHOICES, default="Member", editable=True)
    foodRestriction = models.CharField(max_length=50, blank=True, editable=True)
    created_at = models.DateTimeField(auto_now_add=True)
    qr_token = models.UUIDField(default=uuid.uuid4, unique=True, editable=False)
    qr_code = models.ImageField(upload_to="qr_codes/", blank=True, null=True)

    def _generate_qr(self) -> None:
        img = qrcode.make(str(self.qr_token))
        buffer = BytesIO()
        img.save(buffer, format="PNG")
        filename = f"qr_{self.program}_{self.lastName}_{self.firstName}_{self.middleName}_{self.studentNumber}.png"
        self.qr_code.save(filename, File(buffer), save=False)

    def save(self, *args, **kwargs):
        creating = self._state.adding
        if creating or not self.qr_code:
            self._generate_qr()
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.program} {self.lastName}, {self.firstName}, {self.middleName} ({self.studentNumber})"
