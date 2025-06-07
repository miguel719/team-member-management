from django.urls import path
from .views import SignupView
from rest_framework_simplejwt.views import TokenObtainPairView
from .views import MemberListView
from .views import UpdateProfileView
from .views import CreateMemberView
from .views import DeleteMemberView

urlpatterns = [
    path('signup/', SignupView.as_view(), name='signup'),
    path('login/', TokenObtainPairView.as_view(), name='login'),
    path('profiles/<int:user_id>/', UpdateProfileView.as_view(), name='update-profile'),
    path('add/', CreateMemberView.as_view(), name="create-member"),
    path('', MemberListView.as_view(), name='member-list'),
    path('<int:user_id>/', DeleteMemberView.as_view(), name='delete-member'),
]