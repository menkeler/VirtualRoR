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
            'category': {
                'id': obj.inventory.item.category.id,
                'name': obj.inventory.item.category.name,
            },
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
        item_copies = representation.get('item_copies', [])
        
        # Sort item_copies based on whether they are borrowed or reserved
        sorted_copies = sorted(item_copies, key=lambda x: ( x['is_borrowed'],  x.get('is_reserved', False)))

        representation['item_copies'] = sorted_copies
        return representation