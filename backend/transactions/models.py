from django.db import models
from users.models import User
from inventory.models import Inventory

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
    
class Transaction(models.Model):
    TRANSACTION_TYPES = [
        ('Release', 'Release'),
        ('Donation', 'Donation'),
    ]
    
    date_created = models.DateTimeField(auto_now_add=True)
    type = models.CharField(max_length=20, choices=TRANSACTION_TYPES)
    remarks = models.TextField()
    is_active = models.BooleanField(default=True)
    transaction_items = models.ManyToManyField('TransactionItem', related_name='transactions')

class TransactionItem(models.Model):
    inventory_item = models.ForeignKey(Inventory, on_delete=models.CASCADE, related_name='TransactionItem')
    quantity = models.PositiveIntegerField()
    
