from django.db import models
from users.models import User
from inventory.models import Inventory ,ItemCopy
from django.db.models.signals import post_save
from django.dispatch import receiver
from posts.models import Post 

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
        ('Processed', 'Processed'),
    ]
    inquirer = models.ForeignKey(User, on_delete=models.CASCADE, related_name='inquiries')
    message = models.TextField()
    inquiry_type = models.CharField(max_length=20, choices=INQUIRY_TYPES)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Pending')
    date_preferred = models.DateField()
    date_created = models.DateTimeField(auto_now_add=True)
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='inquiries', null=True, blank=True) 
    
    
class InquiryReply(models.Model):
    message = models.TextField()

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
    inquiry = models.ForeignKey(Inquiry, on_delete=models.CASCADE, null=True, blank=True)

class TransactionItem(models.Model):
    TRANSACTION_ITEM_STATUS = [
        ('Active', 'Active'),
        ('Returned', 'Returned'),
        ('Lost', 'Lost'),
        ('Consumable', 'Consumable'),
    ]
    CONDITION_CHOICES = [
        ('Acceptable', 'Acceptable'),
        ('Good', 'Good'),
        ('Like new', 'Like new'),
        ('Damaged', 'Damaged'),
        ('Lost', 'Lost'),
    ]
    
    transaction = models.ForeignKey(Transaction, on_delete=models.CASCADE, related_name='transaction_items')
    #for Inventory Items that are consumable
    inventory = models.ForeignKey(Inventory, on_delete=models.CASCADE, null=True, blank=True, related_name='transaction_items_inventory')
    #for Item Copies Items that are returnable
    item = models.ForeignKey(ItemCopy, on_delete=models.CASCADE, null=True, blank=True, related_name='transaction_items_itemcopy')
    quantity = models.PositiveIntegerField()
    return_date = models.DateField(null=True, blank=True)
    status = models.CharField(max_length=10, choices=TRANSACTION_ITEM_STATUS, null=True, blank=True)
    # QUestion why is there a condition here? since if i change the condition of the item copy directly it will affect the condtion of the item dispaly 
    # example in an old transaction it first displayed as Good then sudden all display new and old transactions as lost KK
    condition = models.CharField(max_length=50, choices=CONDITION_CHOICES, null=True, blank=True)
    
    def is_transaction_completed(self):
        return self.transaction.transaction_items.filter(status='Active').count() == 0

@receiver(post_save, sender=TransactionItem)
def update_transaction_status(sender, instance, created, **kwargs):
    """
    Signal handler to update Transaction status when a new TransactionItem is saved.
    """
    if not created and (instance.status == 'Returned' or instance.status == 'Lost'):
        transaction = instance.transaction
        if transaction.is_active and transaction.transaction_items.filter(status='Active').count() == 0:
            # All items are returned, update the Transaction status to 'Completed'
            transaction.is_active = False
            transaction.save()