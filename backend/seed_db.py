import os
import django

# Adjust 'backend.settings' based on your project structure
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from users.factories import UserFactory

def seed_database():
    # Create multiple users
    users = UserFactory.create_batch(200)
    print(f"Created {len(users)} users")

if __name__ == "__main__":
    seed_database()