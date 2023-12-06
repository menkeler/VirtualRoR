from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver

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
    borrowed_quantity = models.PositiveIntegerField(default=0)

    def __str__(self):
        return f"{self.item.name} - Available: {self.quantity} - Borrowed: {self.borrowed_quantity}"

    def save(self, *args, **kwargs):
        # Check if there is an existing inventory item with the same item ID
        existing_inventory = Inventory.objects.filter(item=self.item).exclude(id=self.id).first()

        if existing_inventory:
            # Combine the quantities and borrowed quantities
            existing_inventory.quantity += self.quantity
            existing_inventory.borrowed_quantity += self.borrowed_quantity
            existing_inventory.save()
        else:
            super(Inventory, self).save(*args, **kwargs)

            # Automatically generate ItemCopy entries for returnable items
            if self.item.returnable:
                # Check if there are lost copies and update the quantity accordingly
                lost_copies = ItemCopy.objects.filter(inventory=self, condition="Lost")
                if lost_copies.exists():
                    self.quantity -= lost_copies.count()
                    self.save()

                # Create ItemCopy entries for the remaining available quantity
                available_copies = self.quantity - ItemCopy.objects.filter(inventory=self).count()
                for _ in range(available_copies):
                    ItemCopy.objects.create(inventory=self, condition="Good", is_borrowed=False)

    def get_item(self, quantity):
        if quantity <= self.quantity:
            self.quantity -= quantity
            # If the item is returnable, put the item in the Borrowed quantity
            if self.item.returnable:
                self.borrowed_quantity += quantity
            self.save()
            return True
        return False

    def return_item(self, quantity):
        if self.borrowed_quantity >= quantity:
            self.quantity += quantity
            # If the item is returnable, update the borrowed quantity
            if self.item.returnable:
                self.borrowed_quantity -= quantity
            self.save()
            return True
        return False


class ItemCopy(models.Model):
    inventory = models.ForeignKey(Inventory, on_delete=models.CASCADE, related_name='item_copies')
    condition = models.CharField(max_length=50, default='Good')
    is_borrowed = models.BooleanField(default=False)

    def __str__(self):
        return f"Copy {self.id} - Condition: {self.condition} - Borrowed: {self.is_borrowed}"

    def save(self, *args, **kwargs):
        # If the item is marked as borrowed, update the inventory's borrowed quantity
        if self.is_borrowed:
            self.inventory.borrowed_quantity += 1
            self.inventory.save()
        super(ItemCopy, self).save(*args, **kwargs)

    def return_item(self):
        # If the item is returned, update the inventory's borrowed quantity
        if self.is_borrowed:
            self.inventory.borrowed_quantity -= 1
            self.inventory.save()
        self.is_borrowed = False
        self.save()

