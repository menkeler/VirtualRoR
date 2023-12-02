from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions, status
from django.shortcuts import get_object_or_404
from .serializers import ItemSerializer ,InventorySerializer,BorrowableItemCopySerializer
from .models import Item ,Inventory,BorrowableItemCopy
class AddItem(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request):
        serializer = ItemSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ViewItems(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request):
        items = Item.objects.all()
        serializer = ItemSerializer(items, many=True)
        return Response(serializer.data)
    
class ViewInventory(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request):
        inventories = Inventory.objects.all()
        inventory_serializer = InventorySerializer(inventories, many=True)
        return Response({'inventory': inventory_serializer.data})
    

class AddInventoryItem(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request):
        item_id = request.data.get('item_id')
        quantity = request.data.get('quantity', 1)

        try:
            item = Item.objects.get(pk=item_id)
        except Item.DoesNotExist:
            return Response({'error': f'Item with id {item_id} does not exist.'}, status=404)

        inventory, created = Inventory.objects.get_or_create(item=item)

        if not created:
            inventory.quantity += quantity
            inventory.save()
        else:
            inventory.quantity = quantity
            inventory.save()

        inventory_serializer = InventorySerializer(inventory)
        return Response({'inventory': inventory_serializer.data})
    
class ViewBorrowableItemCopies(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request, format=None):
        # Retrieve all borrowable item copies
        borrowable_copies = BorrowableItemCopy.objects.all()

        # Serialize the borrowable item copies data
        serializer = BorrowableItemCopySerializer(borrowable_copies, many=True)

        return Response(serializer.data)