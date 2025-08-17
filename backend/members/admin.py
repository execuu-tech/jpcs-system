from django.contrib import admin
from .models import Members

# Register your models here.
@admin.register(Members)
class MembersAdmin(admin.ModelAdmin):
    list_display = ('studentNumber', 'firstName', 'lastName', 'yearLevel', 'program', 'cspcEmail', 'contactNumber', 'position')
    search_fields = ('studentNumber', 'firstName', 'lastName', 'cspcEmail')
    list_filter = ('program', 'yearLevel', 'position')
    ordering = ('lastName', 'firstName')
    readonly_fields = ('qr_code',)