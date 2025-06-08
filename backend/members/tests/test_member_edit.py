# members/tests/test_member_edit.py

import pytest
from rest_framework.test import APIClient
from members.models import CustomUser, Profile
from uuid import uuid4

@pytest.mark.django_db
class TestMemberEdit:
    def setup_method(self):
        self.client = APIClient()

        # Crear usuario admin
        self.admin_email = f"admin_edit_{uuid4().hex[:5]}@example.com"
        self.admin = CustomUser.objects.create_user(
            username=self.admin_email,
            email=self.admin_email,
            password="adminpass",
            role="admin"
        )
        Profile.objects.create(user=self.admin, email=self.admin_email)

        res = self.client.post("/members/login/", {"username": self.admin_email, "password": "adminpass"})
        self.admin_token = res.data["access"]

        # Crear usuario regular
        self.user_email = f"user_edit_{uuid4().hex[:5]}@example.com"
        self.user = CustomUser.objects.create_user(
            username=self.user_email,
            email=self.user_email,
            password="userpass",
            role="regular"
        )
        Profile.objects.create(user=self.user, email=self.user_email)

        res = self.client.post("/members/login/", {"username": self.user_email, "password": "userpass"})
        self.user_token = res.data["access"]

    def test_15_admin_can_edit_user_data(self):
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {self.admin_token}")
        res = self.client.patch(f"/members/{self.user.id}/", {
            "first_name": "NuevoNombre",
            "last_name": "NuevoApellido",
            "phone": "123456789"
        }, format="json")
        assert res.status_code == 200
        assert res.data["profile"]["first_name"] == "NuevoNombre"
        assert res.data["profile"]["last_name"] == "NuevoApellido"

    def test_16_admin_can_change_role(self):
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {self.admin_token}")
        res = self.client.patch(f"/members/{self.user.id}/", {"role": "admin"}, format="json")
        assert res.status_code == 200
        assert res.data["role"] == "admin"

    def test_17_regular_user_can_submit_regular_role(self):
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {self.user_token}")
        res = self.client.patch(f"/members/{self.user.id}/", {"role": "regular"}, format="json")
        assert res.status_code == 200
        assert res.data["role"] == "regular"
    def test_18_regular_user_cannot_assign_admin_role(self):
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {self.user_token}")
        res = self.client.patch(f"/members/{self.user.id}/", {"role": "admin"}, format="json")
        assert res.status_code == 403
