import pytest
from rest_framework.test import APIClient
from django.urls import reverse
from members.models import CustomUser


@pytest.mark.django_db
class TestLogin:

    def setup_method(self):
        self.client = APIClient()
        self.login_url = reverse("login")
        self.user = CustomUser.objects.create_user(
            username="user@example.com",
            email="user@example.com",
            password="securepass"
        )

    def test_04_login_with_valid_credentials(self):
        response = self.client.post(self.login_url, {
            "username": "user@example.com",
            "password": "securepass"
        }, format="json")

        assert response.status_code == 200
        assert "access" in response.data
        assert "refresh" in response.data

    def test_05_login_with_invalid_credentials(self):
        response = self.client.post(self.login_url, {
            "username": "user@example.com",
            "password": "wrongpassword"
        }, format="json")

        assert response.status_code == 401
        assert "access" not in response.data
