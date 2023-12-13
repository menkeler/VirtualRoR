from rest_framework import serializers
from .models import ItemProfiling, Category, Inventory, ItemCopy

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'

class ItemProfilingCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = ItemProfiling
        fields = '__all__'

class ItemProfilingSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)

    class Meta:
        model = ItemProfiling
        fields = '__all__'

class ItemCopySerializer(serializers.ModelSerializer):
    class Meta:
        model = ItemCopy
        fields = '__all__'

class InventoryCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Inventory
        fields = '__all__'

class InventorySerializer(serializers.ModelSerializer):
    item = ItemProfilingSerializer(read_only=True)
    item_copies = ItemCopySerializer(many=True, read_only=True)

    class Meta:
        model = Inventory
        fields = '__all__'