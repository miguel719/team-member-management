from rest_framework import serializers
from .models import CustomUser, Profile

class ProfileSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(required=False)
    phone = serializers.CharField(required=False)

    class Meta:
        model = Profile
        fields = ["email", "phone", "first_name", "last_name"]

    def validate_email(self, value):
        queryset = Profile.objects.filter(email=value)
        if self.instance:
            queryset = queryset.exclude(id=self.instance.id)
        if queryset.exists():
            raise serializers.ValidationError("Email already in use.")
        return value

    def validate_phone(self, value):
        if value and (not value.isdigit() or len(value) != 10):
            raise serializers.ValidationError("Phone must contain exactly 10 digits.")
        return value

class UserWithProfileSerializer(serializers.ModelSerializer):
    profile = ProfileSerializer(read_only=True)

    class Meta:
        model = CustomUser
        fields = ["id", "email", "role", "profile"]
