from django.urls import path
from .views import SignupView
from rest_framework_simplejwt.views import TokenObtainPairView
from .views import MemberListView

urlpatterns = [
    path('signup/', SignupView.as_view(), name='signup'),
    path('login/', TokenObtainPairView.as_view(), name='login'),
    path('', MemberListView.as_view(), name='member-list'),
]