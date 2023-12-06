from django.db import models
from users.models import User
from inventory.models import Inventory ,ItemCopy
from django.core.exceptions import ValidationError

#Inquiry Side
class Inquiry(models.Model):
    INQUIRY_TYPES = [
        ('Reservation', 'Reservation'),
        ('Donation', 'Donation'),
    ]
    STATUS_CHOICES = [
        ('Pending', 'Pending'),
        ('Accepted', 'Accepted'),
        ('Rejected', 'Rejected'),
        ('Cancelled', 'Cancelled'),
    ]
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='inquiries')
    message = models.TextField()
    inquiry_type = models.CharField(max_length=20, choices=INQUIRY_TYPES)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Pending')
    date_preferred = models.DateField()
    date_created = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.inquiry_type} Inquiry by {self.user.first_name} {self.user.last_name}"   
    
class ReservedItem(models.Model):
    Inquiry = models.ForeignKey(Inquiry, on_delete=models.CASCADE, related_name='reserved_items')
    inventory_item = models.ForeignKey(Inventory, on_delete=models.CASCADE, related_name='ReserveItem')
    item_copy = models.ForeignKey(ItemCopy, on_delete=models.CASCADE, null=True, blank=True, related_name='ReserveItem_itemcopy')
    quantity = models.PositiveIntegerField()
    
    
#Transaction Side  

class Transaction(models.Model):
    TRANSACTION_TYPES = [
        ('Release', 'Release'),
        ('Donation', 'Donation'),
    ]
    
    date_created = models.DateTimeField(auto_now_add=True)
    type = models.CharField(max_length=20, choices=TRANSACTION_TYPES)
    remarks = models.TextField()
    is_active = models.BooleanField(default=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='transactions')

class TransactionItem(models.Model):
    transaction = models.ForeignKey(Transaction, on_delete=models.CASCADE, related_name='transaction_items')
    inventory_item = models.ForeignKey(Inventory, on_delete=models.CASCADE, null=True, blank=True, related_name='transaction_items_inventory')
    item_copy = models.ForeignKey(ItemCopy, on_delete=models.CASCADE, null=True, blank=True, related_name='transaction_items_itemcopy')
    quantity = models.PositiveIntegerField()
    return_date = models.DateField(null=True, blank=True)
    
    def clean(self):
        if self.item_copy and not self.return_date:
            raise ValidationError("Specify a return date for items with item_copy.")

    def save(self, *args, **kwargs):
        self.clean()
        super().save(*args, **kwargs)
