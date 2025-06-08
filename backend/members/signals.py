from django.db.models.signals import post_migrate
from django.dispatch import receiver
from django.contrib.auth import get_user_model
from members.models import Profile
import random

User = get_user_model()

@receiver(post_migrate)
def create_seed_users(sender, **kwargs):
    if User.objects.filter(username="admin@example.com").exists():
        return

    print("Seeding default users...")

    # Admin
    admin = User.objects.create_superuser(
        username="admin@example.com",
        email="admin@example.com",
        password="adminpass",
        role="admin"
    )
    Profile.objects.create(
        user=admin,
        email=admin.email,
        first_name="Admin",
        last_name="Adminson",
        phone="5551000001"
    )

    first_names = ["Emily", "John", "Sophia", "David", "Olivia", "James"]
    last_names = ["Johnson", "Smith", "Brown", "Taylor", "Lee", "Walker"]

    # 3 regular users
    for i in range(1, 4):
        email = f"user{i}@example.com"
        fname = random.choice(first_names)
        lname = random.choice(last_names)
        phone = f"55510000{i+1}"

        user = User.objects.create_user(
            username=email,
            email=email,
            password="userpass",
            role="regular"
        )

        Profile.objects.create(
            user=user,
            email=email,
            first_name=fname,
            last_name=lname,
            phone=phone
        )

    print("Default users created.")
