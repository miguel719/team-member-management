import pytest
from rest_framework.test import APIClient
from django.urls import reverse
from members.models import CustomUser


@pytest.mark.django_db
class TestSignup:

    def setup_method(self):
        self.client = APIClient()
        self.signup_url = reverse("signup")

    def test_01_create_user_with_valid_data(self):
        data = {
            "email": "testuser@example.com",
            "password": "securepassword123",
            "first_name": "John",
            "last_name": "Doe",
            "phone": "1234567890"
        }

        response = self.client.post(self.signup_url, data, format="json")

        assert response.status_code == 201
        assert "message" in response.data
        assert CustomUser.objects.filter(email=data["email"]).exists()

    def test_02_reject_if_missing_email_or_password(self):
        response1 = self.client.post(self.signup_url, {
            "password": "123"
        }, format="json")

        response2 = self.client.post(self.signup_url, {
            "email": "missingpass@example.com"
        }, format="json")

        assert response1.status_code == 400
        assert response2.status_code == 400
        assert "error" in response1.data
        assert "error" in response2.data

    def test_03_reject_if_email_already_registered(self):
        email = "duplicate@example.com"
        CustomUser.objects.create_user(username=email, email=email, password="123456")

        response = self.client.post(self.signup_url, {
            "email": email,
            "password": "anotherpass"
        }, format="json")

        assert response.status_code == 400
        assert "error" in response.data
