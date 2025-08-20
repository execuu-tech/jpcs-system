from rest_framework import serializers
from .models import Members

class MembersSerializer(serializers.ModelSerializer):
    class Meta:
        model = Members
        fields = '__all__'
        read_only_fields = ('qr_token', 'qr_code', 'created_at')  

    def get_displayName(self, obj):
        mid = f" {obj.middleName[0]}." if obj.middleName else ""
        return f"{obj.lastName}, {obj.firstName}{mid}"

    def get_fullName(self, obj):
        parts = [obj.firstName, obj.middleName, obj.lastName]
        return " ".join([p for p in parts if p]).strip()