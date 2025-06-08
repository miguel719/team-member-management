import pytest
from rest_framework.test import APIClient
from members.models import CustomUser
from django.urls import reverse

@pytest.mark.django_db
class TestMemberList:

    def setup_method(self):
        self.client = APIClient()
        self.user = CustomUser.objects.create_user(
            username="regular@example.com", email="regular@example.com", password="testpass"
        )
        self.token = self.client.post(
            reverse("login"),
            {"username": "regular@example.com", "password": "testpass"},
            format="json"
        ).data["access"]
        self.url = reverse("member-list")

    def test_08_get_member_list_authenticated(self):
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {self.token}")
        response = self.client.get(self.url)
        assert response.status_code == 200
        assert isinstance(response.data, list)

    def test_09_reject_member_list_without_auth(self):
        self.client.credentials()  # Clear auth
        response = self.client.get(self.url)
        assert response.status_code == 401
