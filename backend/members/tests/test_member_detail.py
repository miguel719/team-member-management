# members/tests/test_member_detail.py

import pytest
from rest_framework.test import APIClient
from members.models import CustomUser

@pytest.mark.django_db
class TestMemberDetail:
    def setup_method(self):
        self.client = APIClient()
        self.user = CustomUser.objects.create_user(
            username="user@example.com", email="user@example.com", password="userpass", role="regular"
        )
        res = self.client.post("/members/login/", {"username": "user@example.com", "password": "userpass"})
        self.token = res.data["access"]

    def test_18_get_member_detail_authenticated(self):
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {self.token}")
        res = self.client.get(f"/members/{self.user.id}/")
        assert res.status_code == 200
        assert res.data["email"] == "user@example.com"

    def test_19_reject_get_member_detail_unauthenticated(self):
        res = self.client.get(f"/members/{self.user.id}/")
        assert res.status_code == 401
