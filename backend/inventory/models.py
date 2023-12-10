from django.db import models

class Category(models.Model):
    name = models.CharField(max_length=150)

    def __str__(self):
        return self.name

class ItemProfiling(models.Model):   
    name = models.CharField(max_length=150, unique=True)
    returnable = models.BooleanField(default=False)
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True)
    description = models.TextField()
    image = models.ImageField(upload_to='items/', default='default.png')

    def __str__(self):
        return self.name

class Inventory(models.Model):
    item = models.ForeignKey(ItemProfiling, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=0)

    def __str__(self):
        return f"{self.item.name} - Quantity: {self.quantity}"

class ItemCopy(models.Model):
    CONDITION_CHOICES = [
        ('Acceptable', 'Acceptable'),
        ('Good', 'Good'),
        ('Like new', 'Like new'),
        ('Damaged', 'Damaged'),
        ('Lost', 'Lost'),
    ]

    inventory = models.ForeignKey(Inventory, on_delete=models.CASCADE, related_name='item_copies')
    condition = models.CharField(max_length=50, choices=CONDITION_CHOICES, default='Good')
    is_borrowed = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.inventory.item.name} - Condition: {self.condition}, Borrowed: {self.is_borrowed}"