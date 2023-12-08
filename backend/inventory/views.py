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