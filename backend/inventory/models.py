from django.db import models

class Category(models.Model):
    name = models.CharField(max_length=150)

class Item(models.Model):
    ITEM_TYPES = [
        ('B', 'Borrowable'),
        ('C', 'Consumable'),
    ]

    name = models.CharField(max_length=150, unique=True)
    type = models.CharField(max_length=1, choices=ITEM_TYPES)
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True)
    description = models.TextField()
    image = models.ImageField(upload_to='items/', default='default.png')

class BorrowableItemCopy(models.Model):
    item = models.ForeignKey(Item, on_delete=models.CASCADE)
    description = models.TextField()
    is_borrowed = models.BooleanField(default=False)
    is_lost = models.BooleanField(default=False)

class Inventory(models.Model):
    item = models.OneToOneField(Item, on_delete=models.CASCADE, primary_key=True)
    quantity = models.PositiveIntegerField(default=0)

    def update_copies(self):
        # Ensure the number of BorrowableItemCopy instances matches the quantity
        current_copies = BorrowableItemCopy.objects.filter(item=self.item).count()

        if self.item.type == 'B':  # Check if the item is of type 'Borrowable'
            if current_copies < self.quantity:
                # Create additional copies if needed
                for _ in range(self.quantity - current_copies):
                    BorrowableItemCopy.objects.create(
                        item=self.item,
                        description="Some description for the copy",
                        is_borrowed=False,
                        is_lost=False,
                    )
            elif current_copies > self.quantity:
                # Delete extra copies if there are more than needed
                extra_copies = BorrowableItemCopy.objects.filter(item=self.item).order_by('id')[self.quantity:]
                extra_copies.delete()

    def save(self, *args, **kwargs):
        # Call the update_copies method before saving
        self.update_copies()
        super().save(*args, **kwargs)