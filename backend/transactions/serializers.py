from rest_framework import serializers
from .models import Inquiry, Transaction, TransactionItem, ReservedItem

class ReservedItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = ReservedItem
        fields = '__all__'

class InquirySerializer(serializers.ModelSerializer):
    reserved_items = ReservedItemSerializer(many=True, required=False)

    class Meta:
        model = Inquiry
        fields = '__all__'

    def create(self, validated_data):
        reserved_items_data = validated_data.pop('reserved_items', [])
        inquiry = Inquiry.objects.create(**validated_data)

        for reserved_item_data in reserved_items_data:
            ReservedItem.objects.create(inquiry=inquiry, **reserved_item_data)

        return inquiry

class TransactionItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = TransactionItem
        fields = '__all__'

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
