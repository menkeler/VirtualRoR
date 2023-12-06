from rest_framework import serializers
from .models import Inquiry, Transaction, TransactionItem,ReservedItem

class ReservedItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = ReservedItem
        fields = '__all__'

class InquirySerializer(serializers.ModelSerializer):
    reserved_items = ReservedItemSerializer(many=True, read_only=True)

    class Meta:
        model = Inquiry 
        fields = '__all__'

class TransactionItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = TransactionItem
        fields = '__all__'
    # i may remove this later on since the choice here is already set in the front end with a button depends   
    def validate(self, data):
        inventory_item = data.get('inventory_item')
        item_copy = data.get('item_copy')

        if inventory_item and item_copy:
            raise serializers.ValidationError("Specify either inventory_item or item_copy, not both.")
        if not inventory_item and not item_copy:
            raise serializers.ValidationError("Specify either inventory_item or item_copy.")

        return data

class TransactionSerializer(serializers.ModelSerializer):
    transaction_items = TransactionItemSerializer(many=True, read_only=True)

    class Meta:
        model = Transaction
        fields = '__all__'
        
