from rest_framework import serializers
from .models import Category, Item, BorrowableItemCopy, Inventory

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'

class ItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = Item
        fields = '__all__'

class BorrowableItemCopySerializer(serializers.ModelSerializer):
    class Meta:
        model = BorrowableItemCopy
        fields = '__all__'

class InventorySerializer(serializers.ModelSerializer):
    available_quantity = serializers.SerializerMethodField()

    class Meta:
        model = Inventory
        fields = '__all__'

    def get_available_quantity(self, obj):
        borrowed_items = BorrowableItemCopy.objects.filter(item=obj.item, is_borrowed=True).count()
        return obj.quantity - borrowed_items

