from rest_framework import serializers
from .models import ItemProfiling, Category, Inventory, ItemCopy

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'

class ItemProfilingSerializer(serializers.ModelSerializer):
    category = serializers.PrimaryKeyRelatedField(queryset=Category.objects.all())

    class Meta:
        model = ItemProfiling
        fields = '__all__'

class ItemCopySerializer(serializers.ModelSerializer):
    class Meta:
        model = ItemCopy
        fields = '__all__'

class InventorySerializer(serializers.ModelSerializer):
    item = serializers.PrimaryKeyRelatedField(queryset=ItemProfiling.objects.all())
    item_copies = ItemCopySerializer(many=True, read_only=True)

    class Meta:
        model = Inventory
        fields = '__all__'
