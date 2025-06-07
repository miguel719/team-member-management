from django.shortcuts import render

from django.contrib.auth import authenticate
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import get_user_model
User = get_user_model()
from rest_framework.permissions import IsAuthenticated

from .models import Profile

class SignupView(APIView):
    def post(self, request):
        email = request.data.get("email")
        password = request.data.get("password")
        phone = request.data.get("phone")
        first_name = request.data.get("first_name")
        last_name = request.data.get("last_name")

        if not email or not password:
            return Response({"error": "Email and password are required"}, status=status.HTTP_400_BAD_REQUEST)

        if User.objects.filter(username=email).exists():
            return Response({"error": "Email already registered"}, status=status.HTTP_400_BAD_REQUEST)

        user = User.objects.create_user(username=email, email=email, password=password)

        Profile.objects.create(
            user=user,
            email=email,
            phone=phone or "",
            first_name=first_name or "",
            last_name=last_name or ""
        )

        return Response({"message": "User created successfully"}, status=status.HTTP_201_CREATED)


class MemberListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        users = User.objects.all()
        emails = [user.email for user in users]
        return Response({"emails": emails})
        