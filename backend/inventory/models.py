from django.db import models
from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver

class Category(models.Model):
    name = models.CharField(max_length=150 , unique=True)
    
    def delete(self, *args, **kwargs):
        # Get or create the "Uncategorized" category
        uncategorized_category, created = Category.objects.get_or_create(name='Uncategorized')

        # Update products associated with this category to "Uncategorized"
        products_to_update = ItemProfiling.objects.filter(category=self)
        products_to_update.update(category=uncategorized_category)

        # Call the parent class delete method to perform the actual deletion
        super().delete(*args, **kwargs)
        
    def __str__(self):
        return self.name

class ItemProfiling(models.Model):   
    name = models.CharField(max_length=150, unique=True)
    returnable = models.BooleanField(default=False)
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True)
    description = models.TextField(null=True, blank=True)
    image = models.ImageField(upload_to='items/', default='default.png')
    isDeleted = models.BooleanField(default=False)
    def __str__(self):
        return self.name

class Inventory(models.Model):
    item = models.ForeignKey(ItemProfiling, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=0)
    reserved_quantity = models.PositiveIntegerField(default=0)
    borrowed_quantity = models.PositiveIntegerField(default=0)
    is_hidden = models.BooleanField(default=False)
    def __str__(self):
        return f"{self.item.name} - Quantity: {self.quantity}"

class ItemCopy(models.Model):
    CONDITION_CHOICES = [
        ('Good', 'Good'),
        ('Slightly Damaged', 'Slightly Damaged'),
        ('Damaged', 'Damaged'),
        ('Broken', 'Broken'),
        ('Lost', 'Lost'),
    ]

    inventory = models.ForeignKey(Inventory, on_delete=models.CASCADE, related_name='item_copies')
    condition = models.CharField(max_length=50, choices=CONDITION_CHOICES, default='Good')
    is_reserved = models.BooleanField(default=False)
    is_borrowed = models.BooleanField(default=False)
    previous_is_borrowed = models.BooleanField(default=False)  # Change to BooleanField
    display_id = models.CharField(max_length=50, editable=False)  # Add a field for display ID

    def save(self, *args, **kwargs):
        print(f"Before save - Current is_borrowed: {self.is_borrowed}, Previous is_borrowed: {self.previous_is_borrowed}")

        # Save the current value of is_borrowed before it gets updated by the super().save()
        current_is_borrowed = self.is_borrowed

        if not self.display_id:
        
            total_copies = ItemCopy.objects.filter(inventory=self.inventory).count()
   
            total_copies += 1

            self.display_id = f"{self.inventory.id}-{total_copies}"

        super().save(*args, **kwargs)

        # Update previous_is_borrowed after the save operation
        if current_is_borrowed != self.previous_is_borrowed:
            self.previous_is_borrowed = current_is_borrowed

        print(f"After save - Current is_borrowed: {self.is_borrowed}, Previous is_borrowed: {self.previous_is_borrowed}")

    def __str__(self):
        return f"{self.inventory.item.name} - Condition: {self.condition}, Borrowed: {self.is_borrowed}"
    
class ExportHistory(models.Model):
    filename = models.CharField(max_length=255)
    export_date = models.DateTimeField(auto_now_add=True)

        
@receiver(post_save, sender=ItemCopy)
def update_inventory_quantity_on_save(sender, instance, created, **kwargs):
    """
    Signal handler to update Inventory quantity when a new ItemCopy is saved.
    When using put requests, it also updates when updating the condition and the is_borrowed status of the item
    """
    if instance.inventory.item.returnable:
        if created or (not instance.is_borrowed and instance.is_borrowed != instance.previous_is_borrowed):
            # Increment quantity if it's a new ItemCopy or is_borrowed changed to False and condition changed
            instance.inventory.quantity += 1
            if instance.inventory.borrowed_quantity > 0:
                instance.inventory.borrowed_quantity -= 1
        elif instance.is_borrowed and instance.is_borrowed != instance.previous_is_borrowed:
            # Decrement quantity if is_borrowed is True and condition changed
            instance.inventory.quantity -= 1
            instance.inventory.borrowed_quantity += 1
        elif instance.is_reserved:
            # Increment reserved quantity when item is marked as reserved
            instance.inventory.reserved_quantity += 1
        elif not instance.is_reserved:
            # Increment reserved quantity when item is marked as reserved
            instance.inventory.reserved_quantity -= 1
        
        instance.inventory.save()


        
@receiver(post_delete, sender=ItemCopy)
def update_inventory_quantity_on_delete(sender, instance, **kwargs):
    """
    Signal handler to update Inventory quantity when an ItemCopy is deleted.
    """
    if instance.inventory.item.returnable and not instance.is_borrowed: 
        instance.inventory.quantity -= 1
        instance.inventory.save()