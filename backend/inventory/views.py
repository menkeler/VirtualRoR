from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Category, ItemProfiling, ItemCopy, Inventory
from .serializers import CategorySerializer, ItemProfilingSerializer, ItemCopySerializer, InventorySerializer
from django.shortcuts import get_object_or_404
from rest_framework import viewsets

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

class ItemProfilingViewSet(viewsets.ModelViewSet):
    queryset = ItemProfiling.objects.all()
    serializer_class = ItemProfilingSerializer

class ItemCopyViewSet(viewsets.ModelViewSet):
    queryset = ItemCopy.objects.all()
    serializer_class = ItemCopySerializer

class EditItemCopyStatusViewSet(viewsets.ModelViewSet):
    queryset = ItemCopy.objects.all()
    serializer_class = ItemCopySerializer

    def get_object(self):
        return get_object_or_404(ItemCopy, inventory__id=self.kwargs['inventory_id'], id=self.kwargs['item_id'])

class InventoryViewSet(viewsets.ModelViewSet):
    queryset = Inventory.objects.all()
    serializer_class = InventorySerializer

    def create(self, request, *args, **kwargs):
        item_id = request.data.get("item")
        quantity_to_add_str = request.data.get("quantity", "0")

        try:
            quantity_to_add = int(quantity_to_add_str)
        except ValueError:
            return Response({"error": "Invalid quantity format"}, status=status.HTTP_400_BAD_REQUEST)

        inventory_instance, created = Inventory.objects.get_or_create(item_id=item_id, defaults={"quantity": 0})
        inventory_instance.quantity += quantity_to_add
        inventory_instance.save()

        serializer = InventorySerializer(inventory_instance)
        return Response(serializer.data, status=status.HTTP_201_CREATED)