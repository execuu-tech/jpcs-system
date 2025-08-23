from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
import os


class Command(BaseCommand):
    help = "Create a superuser if none exists"

    def handle(self, *args, **kwargs):
        User = get_user_model()
        if not User.objects.filter(is_superuser=True).exists():
            User.objects.create_superuser(
                username=os.getenv("DJANGO_SUPERUSER_USERNAME", "admin"),
                email=os.getenv("DJANGO_SUPERUSER_EMAIL", "admin@admin.com"),
                password=os.getenv("DJANGO_SUPERUSER_PASSWORD", "admin"),
            )
            self.stdout.write(self.style.SUCCESS("Superuser created"))
        else:
            self.stdout.write(self.style.WARNING("Superuser already exists"))

