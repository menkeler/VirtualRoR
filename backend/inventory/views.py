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
    
    def get(self, request):
        item_profiling = ItemProfiling.objects.all()
        serializer = ItemProfilingSerializer(item_profiling, many=True)
        return Response(serializer.data)

class HandleSingleItemProfiling(APIView):
    def get(self, request, id):
        try:
            item = ItemProfiling.objects.get(id=id)
            serializer = ItemProfilingSerializer(item)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except ItemProfiling.DoesNotExist:
            return Response({"detail": "Item not found"}, status=status.HTTP_404_NOT_FOUND)

   
class HandleItemCopy(APIView):
    def get(self, request):
        item_copies = ItemCopy.objects.all()
        serializer = ItemCopySerializer(item_copies, many=True)
        return Response(serializer.data)



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
