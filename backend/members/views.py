from django.shortcuts import render

from django.contrib.auth import authenticate
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import get_user_model
User = get_user_model()
from rest_framework.permissions import IsAuthenticated
from .serializers import UserWithProfileSerializer
from members.models import CustomUser
from members.permissions import IsAdminRole
from .serializers import ProfileSerializer
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
        users = CustomUser.objects.all()
        serializer = UserWithProfileSerializer(users, many=True)
        return Response(serializer.data)

class UpdateProfileView(APIView):
    permission_classes = [IsAuthenticated]
    def patch(self, request, user_id=None):
        try:
            target_user = request.user if user_id is None else CustomUser.objects.get(id=user_id)
            profile = Profile.objects.get(user=target_user)
        except (CustomUser.DoesNotExist, Profile.DoesNotExist):
            return Response({"error": "User or profile not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = ProfileSerializer(profile, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            user_serializer = UserWithProfileSerializer(target_user)
            return Response(user_serializer.data)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class CreateMemberView(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request):
        email = request.data.get("email")
        phone = request.data.get("phone")
        first_name = request.data.get("first_name")
        last_name = request.data.get("last_name")

        if not email:
            return Response({"error": "Email is required"}, status=status.HTTP_400_BAD_REQUEST)

        if User.objects.filter(username=email).exists():
            return Response({"error": "User with this email already exists"}, status=status.HTTP_400_BAD_REQUEST)

        user = User(username=email, email=email)
        user.set_unusable_password()
        user.save()

        Profile.objects.create(
            user=user,
            email=email,
            phone=phone or "",
            first_name=first_name or "",
            last_name=last_name or ""
        )

        return Response(UserWithProfileSerializer(user).data, status=status.HTTP_201_CREATED)


class DeleteMemberView(APIView):
    permission_classes = [IsAuthenticated, IsAdminRole]

    def delete(self, request, user_id):
        try:
            user = CustomUser.objects.get(id=user_id)
        except CustomUser.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

        serialized = UserWithProfileSerializer(user).data
        user.delete()

        return Response(serialized, status=status.HTTP_200_OK)