from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser, Profile

@admin.register(CustomUser)
class CustomUserAdmin(UserAdmin):
    model = CustomUser
    list_display = ["username", "email", "role", "is_staff"]
    fieldsets = UserAdmin.fieldsets + (
        ("Extra fields", {"fields": ("role",)}),
    )

admin.site.register(Profile)
