from django.db import models
from users.models import User
from inventory.models import Inventory ,ItemCopy

# Inquiry Side
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
    inquirer = models.ForeignKey(User, on_delete=models.CASCADE, related_name='inquiries')
    message = models.TextField()
    inquiry_type = models.CharField(max_length=20, choices=INQUIRY_TYPES)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Pending')
    date_preferred = models.DateField()
    date_created = models.DateTimeField(auto_now_add=True)

class ReservedItem(models.Model):
    inquiry = models.ForeignKey(Inquiry, on_delete=models.CASCADE, related_name='reserved_items')
    inventory = models.ForeignKey(Inventory, on_delete=models.CASCADE, null=True, blank=True, related_name='reserved_items')
    item = models.ForeignKey(ItemCopy, on_delete=models.CASCADE, null=True, blank=True, related_name='reserved_items_itemcopy')
    quantity = models.PositiveIntegerField()


class Transaction(models.Model):
    TRANSACTION_TYPES = [
        ('Release', 'Release'),
        ('Donation', 'Donation'),
    ]
    
    date_created = models.DateTimeField(auto_now_add=True)
    transaction_type = models.CharField(max_length=20, choices=TRANSACTION_TYPES)
    remarks = models.TextField(null=True, blank=True)
    is_active = models.BooleanField(default=True)
    participant = models.ForeignKey(User, on_delete=models.CASCADE, related_name='transactions')

class TransactionItem(models.Model):
    transaction = models.ForeignKey(Transaction, on_delete=models.CASCADE, related_name='transaction_items')
    #for Inventory Items that are consumable
    inventory = models.ForeignKey(Inventory, on_delete=models.CASCADE, null=True, blank=True, related_name='transaction_items_inventory')
    #for Item Copies Items that are returnable
    item = models.ForeignKey(ItemCopy, on_delete=models.CASCADE, null=True, blank=True, related_name='transaction_items_itemcopy')
    quantity = models.PositiveIntegerField()
    return_date = models.DateField(null=True, blank=True)
        
