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
    categories = CategoryFactory.create_batch(6)
    for category in categories:
        items = ItemProfilingFactory.create_batch_with_category(category, 5)
        for item in items:
            inventory = InventoryFactory(item=item)
            ItemCopyFactory.create_batch(inventory=inventory, size=10)

if __name__ == "__main__":
    seed_database()
