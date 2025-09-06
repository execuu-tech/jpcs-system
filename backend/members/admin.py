from django.contrib import admin
from import_export import resources
from import_export.admin import ImportExportModelAdmin
from .models import Members


class MembersResource(resources.ModelResource):
    class Meta:
        model = Members
        fields = (
            "id",
            "studentNumber",
            "firstName",
            "middleName",
            "lastName",
            "yearLevel",
            "program",
            "block",
            "isReg",
            "cspcEmail",
            "contactNumber",
            "position",
            "foodRestriction",
            "temp_password",
        )
        import_id_fields = ("studentNumber",)

    def before_import_row(self, row, **kwargs):
        if "temp_password" in row:
            row.pop("temp_password")
        return super().before_import_row(row, **kwargs)


@admin.register(Members)
class MembersAdmin(ImportExportModelAdmin):
    resource_class = MembersResource
    list_display = (
        "studentNumber",
        "firstName",
        "lastName",
        "yearLevel",
        "program",
        "block",
        "cspcEmail",
        "contactNumber",
        "position",
        "temp_password",
    )
    search_fields = ("studentNumber", "firstName", "lastName", "cspcEmail")
    list_filter = ("program", "yearLevel", "block", "position")
    ordering = ("lastName", "firstName")
    readonly_fields = ("qr_code",)
