from django.urls import path
from .views import SignupView
from rest_framework_simplejwt.views import TokenObtainPairView
from .views import UpdateProfileView
from .views import CreateMemberView
from .views import MemberViewSet

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import SignupView, MemberViewSet
from rest_framework_simplejwt.views import TokenObtainPairView

router = DefaultRouter()
router.register(r"", MemberViewSet, basename="member")

urlpatterns = [
    path("signup/", SignupView.as_view(), name="signup"),
    path("login/", TokenObtainPairView.as_view(), name="login"),
    path("", include(router.urls)),
]