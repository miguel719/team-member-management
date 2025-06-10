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
from rest_framework.decorators import action
from rest_framework import viewsets
from rest_framework.exceptions import ValidationError
from rest_framework.exceptions import PermissionDenied

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
            raise ValidationError({"email": ["Email is required"]})

        if CustomUser.objects.filter(username=email).exists():
            raise ValidationError({"email": ["Email already registered"]})

        if role == "admin" and request.user.role != "admin":
            raise PermissionDenied("Only admins can assign admin role")

        profile_data = {
            "email": email,
            "phone": data.get("phone", ""),
            "first_name": data.get("first_name", ""),
            "last_name": data.get("last_name", "")
        }

        profile_serializer = ProfileSerializer(data=profile_data)
        profile_serializer.is_valid(raise_exception=True)
        user = CustomUser.objects.create(username=email, email=email, role=role)
        user.set_unusable_password()
        user.save()

        Profile.objects.create(user=user, **profile_serializer.validated_data)

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
        requested_role = data.get("role")
        if requested_role and requested_role != user.role:
            if request.user.role != "admin":
                return Response({"error": "Only admins can change roles."}, status=403)
            user.role = requested_role
            user.save()

        serializer = ProfileSerializer(profile, data=data, partial=True)
        if serializer.is_valid():
            serializer.save()
            user.refresh_from_db()
            return Response(UserWithProfileSerializer(user).data)
        return Response(serializer.errors, status=400)

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
