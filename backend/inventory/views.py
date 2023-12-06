from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Category, ItemProfiling, ItemCopy, Inventory
from .serializers import CategorySerializer, ItemProfilingSerializer, ItemCopySerializer, InventorySerializer
from django.shortcuts import get_object_or_404

class HandleCategory(APIView):
    def post(self, request):
        serializer = CategorySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def get(self, request):
        categories = Category.objects.all()
        serializer = CategorySerializer(categories, many=True)
        return Response(serializer.data)
    
    def get_object(self, pk):
        return get_object_or_404(Category, pk=pk)

    

class HandleItemProfiling(APIView):
    def post(self, request):
        serializer = ItemProfilingSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def get(self, request, id=None):
        # Get one item
        if id is not None:
            item = get_object_or_404(ItemProfiling, id=id)
            serializer = ItemProfilingSerializer(item)
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            # Retrieve all items
            item_profiling = ItemProfiling.objects.all()
            serializer = ItemProfilingSerializer(item_profiling, many=True)
            return Response(serializer.data)


class HandleItemCopy(APIView):
    def get(self, request, inventory_id=None):
        if inventory_id is not None:
            item_copies = ItemCopy.objects.filter(inventory__id=inventory_id)
        else:
            item_copies = ItemCopy.objects.all()

        serializer = ItemCopySerializer(item_copies, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
class EditItemCopyStatus(APIView):
    
    def get(self, request, inventory_id=None, item_id=None):
        item_copy = get_object_or_404(ItemCopy, inventory__id=inventory_id, id=item_id)
        serializer = ItemCopySerializer(item_copy)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def put(self, request, inventory_id=None, item_id=None):
        item_copy = get_object_or_404(ItemCopy, inventory__id=inventory_id, id=item_id)
        
        # To Update Values
        item_copy.condition = request.data.get('condition', item_copy.condition)
        item_copy.is_borrowed = request.data.get('is_borrowed', item_copy.is_borrowed)
        item_copy.save()

        serializer = ItemCopySerializer(item_copy)
        return Response(serializer.data, status=status.HTTP_200_OK)



class HandleInventory(APIView):
    def post(self, request):
        item_id = request.data.get('item')
        quantity = request.data.get('quantity')

        # Check if an inventory with the same item exists
        existing_inventory = Inventory.objects.filter(item=item_id).first()

        if existing_inventory:
            # If it exists, update the quantity
            existing_inventory.quantity += quantity
            existing_inventory.save()
            serializer = InventorySerializer(existing_inventory)
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            # If it doesn't exist, create a new inventory instance
            serializer = InventorySerializer(data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def get(self, request):
        inventories = Inventory.objects.all()
        serializer = InventorySerializer(inventories, many=True)
        return Response(serializer.data)
