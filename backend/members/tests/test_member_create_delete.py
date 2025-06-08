import pytest
from rest_framework.test import APIClient
from django.urls import reverse
from members.models import CustomUser
from uuid import uuid4


@pytest.mark.django_db
class TestMemberCreateDelete:

    def setup_method(self):
        self.client = APIClient()

        self.admin_email = f"admin_{uuid4().hex[:6]}@example.com"
        self.user_email = f"user_{uuid4().hex[:6]}@example.com"

        self.admin_password = "adminpass"
        self.user_password = "userpass"

        self.admin = CustomUser.objects.create_user(
            username=self.admin_email,
            email=self.admin_email,
            password=self.admin_password,
            role="admin"
        )
        self.user = CustomUser.objects.create_user(
            username=self.user_email,
            email=self.user_email,
            password=self.user_password,
            role="regular"
        )

        res_admin = self.client.post("/members/login/", {
            "username": self.admin_email,
            "password": self.admin_password
        })
        self.admin_token = res_admin.data["access"]

        res_user = self.client.post("/members/login/", {
            "username": self.user_email,
            "password": self.user_password
        })
        self.user_token = res_user.data["access"]
        self.url = "/members/"
        
    def test_10_create_regular_user_as_admin(self):
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {self.admin_token}")
        response = self.client.post(self.url, {
            "email": "newuser@example.com",
            "first_name": "New",
            "last_name": "User",
            "phone": "555-1234",
            "role": "regular"
        }, format="json")
        assert response.status_code == 201
        assert response.data["email"] == "newuser@example.com"

    def test_11_create_admin_user_as_admin(self):
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {self.admin_token}")
        response = self.client.post(self.url, {
            "email": "admin2@example.com",
            "first_name": "Admin",
            "last_name": "Two",
            "phone": "555-5678",
            "role": "admin"
        }, format="json")
        assert response.status_code == 201
        assert response.data["role"] == "admin"

    def test_12_reject_admin_creation_by_non_admin(self):
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {self.user_token}")
        response = self.client.post(self.url, {
            "email": "badadmin@example.com",
            "first_name": "Not",
            "last_name": "Allowed",
            "phone": "555-0000",
            "role": "admin"
        }, format="json")
        assert response.status_code == 403

    def test_13_admin_can_delete_member(self):
        # Create user to delete
        user_to_delete = CustomUser.objects.create_user(username="todelete@example.com", email="todelete@example.com")
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {self.admin_token}")
        delete_url = reverse("member-detail", args=[user_to_delete.id])
        response = self.client.delete(delete_url)
        assert response.status_code == 200

    def test_14_regular_cannot_delete_member(self):
        user_to_delete = CustomUser.objects.create_user(username="victim@example.com", email="victim@example.com")
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {self.user_token}")
        delete_url = reverse("member-detail", args=[user_to_delete.id])
        response = self.client.delete(delete_url)
        assert response.status_code == 403
