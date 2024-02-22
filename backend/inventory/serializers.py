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
    inventory = serializers.SerializerMethodField()

    class Meta:
        model = ItemCopy
        fields = '__all__'

    def get_inventory(self, obj):
        inventory_data = {
            'id': obj.inventory.id, 
            'itemprofiling': {
                'id': obj.inventory.item.id,
                'item_name': obj.inventory.item.name,
                'returnable': obj.inventory.item.returnable,
            }
        }
        return inventory_data
    
class ItemCopyCreateSerializer(serializers.ModelSerializer):
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
        
    def to_representation(self, instance):
        representation = super().to_representation(instance)
        sorted_copies = sorted(representation['item_copies'], key=lambda x: x['is_borrowed'])
        representation['item_copies'] = sorted_copies
        return representation