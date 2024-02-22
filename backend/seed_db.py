import os
import django

# Set up Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

# Now you can import Django models and settings
from users.factories import UserFactory
from inventory.factories import CategoryFactory, ItemProfilingFactory, InventoryFactory, ItemCopyFactory

def seed_database():
    # Create multiple users
    users = UserFactory.create_batch(200)
    print(f"Created {len(users)} users")

    # Create instances of Category, ItemProfiling, Inventory, and ItemCopy
    categories = CategoryFactory.create_batch(10)
    for category in categories:
        items = ItemProfilingFactory.create_batch_with_category(category, 10)
        for item in items:
            inventory = InventoryFactory(item=item)
            ItemCopyFactory.create_batch(inventory=inventory, size=20)

if __name__ == "__main__":
    seed_database()
