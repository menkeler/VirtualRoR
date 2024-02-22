from factory.django import DjangoModelFactory
from factory import Sequence, SubFactory, LazyAttribute
from faker import Faker
from faker.providers import misc

from inventory.models import Category, ItemProfiling, Inventory, ItemCopy

# Add the miscellaneous provider for boolean values
fake = Faker()
fake.add_provider(misc)

# Define factories for each model
class CategoryFactory(DjangoModelFactory):
    class Meta:
        model = Category

    name = Sequence(lambda n: f'Category {n}')

class ItemProfilingFactory(DjangoModelFactory):
    class Meta:
        model = ItemProfiling

    name = Sequence(lambda n: f'Item {n}')
    returnable = LazyAttribute(lambda _: fake.boolean())  # Generate True or False values

    @classmethod
    def create_batch_with_category(cls, category, size):
        return [cls(category=category) for _ in range(size)]

class InventoryFactory(DjangoModelFactory):
    class Meta:
        model = Inventory

    # Use LazyAttribute to dynamically determine the quantity based on the returnability of the item
    quantity = LazyAttribute(lambda obj: 0 if obj.item.returnable else 10)
    item = SubFactory(ItemProfilingFactory)

class ItemCopyFactory(DjangoModelFactory):
    class Meta:
        model = ItemCopy

    inventory = SubFactory(InventoryFactory)
    condition = 'Good'
    is_borrowed = False
