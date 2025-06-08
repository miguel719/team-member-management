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
        role = request.data.get("role", "regular")

        if not email:
            return Response({"error": "Email is required"}, status=status.HTTP_400_BAD_REQUEST)

        if CustomUser.objects.filter(username=email).exists():
            return Response({"error": "User with this email already exists"}, status=status.HTTP_400_BAD_REQUEST)

        if role == "admin" and request.user.role != "admin":
            return Response({"error": "Only admins can assign admin role"}, status=status.HTTP_403_FORBIDDEN)

        user = CustomUser(username=email, email=email, role=role)
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


from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from .models import CustomUser, Profile
from .serializers import UserWithProfileSerializer
from members.permissions import IsAdminRole

class MemberViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]

    def list(self, request):
        users = CustomUser.objects.all()
        serializer = UserWithProfileSerializer(users, many=True)
        return Response(serializer.data)

    def retrieve(self, request, pk=None):
        try:
            user = CustomUser.objects.get(id=pk)
            serializer = UserWithProfileSerializer(user)
            return Response(serializer.data)
        except CustomUser.DoesNotExist:
            return Response({"error": "User not found"}, status=404)

    def create(self, request):
        data = request.data
        email = data.get("email")
        role = data.get("role", "regular")
        if not email:
            return Response({"error": "Email is required"}, status=400)

        if CustomUser.objects.filter(username=email).exists():
            return Response({"error": "Email already registered"}, status=400)

        if role == "admin" and request.user.role != "admin":
            return Response({"error": "Only admins can assign admin role"}, status=403)

        user = CustomUser.objects.create(username=email, email=email, role=role)
        user.set_unusable_password()
        user.save()

        Profile.objects.create(
            user=user,
            email=email,
            phone=data.get("phone", ""),
            first_name=data.get("first_name", ""),
            last_name=data.get("last_name", "")
        )

        return Response(UserWithProfileSerializer(user).data, status=201)

    def partial_update(self, request, pk=None):
        try:
            user = CustomUser.objects.get(id=pk)
            profile = user.profile
        except CustomUser.DoesNotExist:
            return Response({"error": "User not found"}, status=404)
        except Profile.DoesNotExist:
            return Response({"error": "Profile not found"}, status=404)

        data = request.data
        if "role" in data:
            if data["role"] == "admin" and request.user.role != "admin":
                return Response({"error": "Only admins can change roles."}, status=403)
            user.role = data["role"]
            user.save()

        for field in ["first_name", "last_name", "phone"]:
            if field in data:
                setattr(profile, field, data[field])
        profile.save()

        return Response(UserWithProfileSerializer(user).data)

    def destroy(self, request, pk=None):
        if request.user.role != "admin":
            return Response({"error": "Only admins can delete members."}, status=403)

        try:
            user = CustomUser.objects.get(id=pk)
        except CustomUser.DoesNotExist:
            return Response({"error": "User not found"}, status=404)

        serialized = UserWithProfileSerializer(user).data
        user.delete()
        return Response(serialized, status=200)

    @action(detail=False, methods=["get"])
    def me(self, request):
        serializer = UserWithProfileSerializer(request.user)
        return Response(serializer.data)
