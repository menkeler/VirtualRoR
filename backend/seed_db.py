# seed_db.py
from users.factories import UserFactory

def seed_database():
    # Create multiple users
    users = UserFactory.create_batch(50)
    print(f"Created {len(users)} users")

if __name__ == "__main__":
    seed_database()
