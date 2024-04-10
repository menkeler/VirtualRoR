from factory import SubFactory, LazyAttribute, fuzzy
from django.db import IntegrityError
from factory.django import DjangoModelFactory
from factory import Sequence
from faker import Faker
from faker.providers import misc
import random

from inventory.models import Category, ItemProfiling, Inventory, ItemCopy

# Initialize Faker
fake = Faker()
fake.add_provider(misc)
# Define a list of realistic categories
realistic_categories = ['Tech', 'Books', 'Clothing', 'Electronics', 'Kitchen', 'Toys']

# Define factories for each model
class CategoryFactory(DjangoModelFactory):
    class Meta:
        model = Category

    # Use a predefined list of realistic categories
    name = Sequence(lambda n: realistic_categories[n % len(realistic_categories)])

# Define the ItemProfilingFactory
class ItemProfilingFactory(DjangoModelFactory):
        class Meta:
            model = ItemProfiling

        # Generate item name with category and random text
        name = Sequence(lambda n: f'{random.choice(realistic_categories)}({fake.word()})')
        returnable = fuzzy.FuzzyChoice([True, False])

        @classmethod
        def create_batch_with_category(cls, category, size):
            # Ensure unique names within the batch
            return [cls(category=category) for _ in range(size)]

# Rest of your factories remain unchanged
class InventoryFactory(DjangoModelFactory):
    class Meta:
        model = Inventory

    @classmethod
    def _create(cls, model_class, *args, **kwargs):
        # Adjust quantities based on item returnability and borrow status
        if 'quantity' not in kwargs:
            if kwargs.get('item') and not kwargs['item'].returnable:
                kwargs['quantity'] = 10  # Default quantity for non-returnable items
            else:
                kwargs['quantity'] = 0   # Default quantity for returnable items

        # Set borrowed quantity based on item returnability
        if 'borrowed_quantity' not in kwargs:
            if kwargs.get('item') and not kwargs['item'].returnable:
                kwargs['borrowed_quantity'] = 0  # No borrowed quantity for non-returnable items
            else:
                kwargs['borrowed_quantity'] = 0   # No borrowed quantity for returnable items
        
        return super()._create(model_class, *args, **kwargs)

    item = SubFactory(ItemProfilingFactory)



class ItemCopyFactory(DjangoModelFactory):
    class Meta:
        model = ItemCopy

    inventory = SubFactory(InventoryFactory)
    condition = 'Good'
    is_borrowed = False
