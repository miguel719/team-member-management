import pytest
from rest_framework.test import APIClient
from django.urls import reverse
from members.models import CustomUser


@pytest.mark.django_db
class TestProfileMe:

    def setup_method(self):
        self.client = APIClient()
        self.user = CustomUser.objects.create_user(
            username="me@example.com",
            email="me@example.com",
            password="mypassword",
            role="regular"
        )
        self.client.login(username="me@example.com", password="mypassword")
        self.token_url = reverse("login")
        res = self.client.post(self.token_url, {
            "username": "me@example.com",
            "password": "mypassword"
        }, format="json")
        self.token = res.data["access"]
        self.me_url = reverse("member-me")

    def test_06_get_current_user_data(self):
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {self.token}")
        response = self.client.get(self.me_url)

        assert response.status_code == 200
        assert response.data["email"] == "me@example.com"
        assert "profile" in response.data

    def test_07_reject_me_if_not_authenticated(self):
        self.client.credentials()  # Remove auth headers
        response = self.client.get(self.me_url)

        assert response.status_code == 401
