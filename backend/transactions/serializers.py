from rest_framework import serializers
from .models import Inquiry, Transaction, TransactionItem, ReservedItem
from users.serializers import UserSerializer  # Import UserSerializer from your users.serializers
from inventory.serializers import InventorySerializer, ItemCopySerializer  # Import serializers for Inventory and ItemCopy

class InquirySerializer(serializers.ModelSerializer):
    inquirer = UserSerializer()  # Assuming you have a UserSerializer

    class Meta:
        model = Inquiry
        fields = '__all__'

class ReservedItemSerializer(serializers.ModelSerializer):
    inquiry = InquirySerializer()
    inventory_item = InventorySerializer()
    item_copy = ItemCopySerializer()

    class Meta:
        model = ReservedItem
        fields = '__all__'

class TransactionItemSerializer(serializers.ModelSerializer):
    inventory_item = InventorySerializer()
    item_copy = ItemCopySerializer()

    class Meta:
        model = TransactionItem
        fields = '__all__'
        
class CreateTransactionItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = TransactionItem
        fields = '__all__'

class TransactionSerializer(serializers.ModelSerializer):
    participant = UserSerializer()  
    transaction_items = TransactionItemSerializer(many=True, read_only=True)

    class Meta:
        model = Transaction
        fields = '__all__'
        
class CreateTransactionSerializer(serializers.ModelSerializer):

    class Meta:
        model = Transaction
        fields = '__all__'