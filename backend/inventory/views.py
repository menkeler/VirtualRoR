from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status,viewsets, filters
from .models import Category, ItemProfiling, ItemCopy, Inventory
from .serializers import CategorySerializer, ItemProfilingSerializer, ItemCopySerializer,ItemCopyCreateSerializer, InventorySerializer,InventoryCreateSerializer,ItemProfilingCreateSerializer
from django.shortcuts import get_object_or_404
from rest_framework import viewsets
from rest_framework.pagination import PageNumberPagination
from django.db.models import Q

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    
class ItemProfilingPagination(PageNumberPagination):
    page_size = 20
    page_size_query_param = 'page_size'
    max_page_size = 1000
    
class ItemProfilingViewSet(viewsets.ModelViewSet):
    queryset = ItemProfiling.objects.all()
    pagination_class = ItemProfilingPagination
    filter_backends = [filters.SearchFilter]
    search_fields = ['name']
    
    #Different Serializer for Creation
    def get_serializer_class(self):
        if self.action == 'create':
            return ItemProfilingCreateSerializer
        return ItemProfilingSerializer
    

class ItemCopyViewSet(viewsets.ModelViewSet):
    queryset = ItemCopy.objects.all()
    
    def get_serializer_class(self):
        if self.action == 'create':
            return ItemCopyCreateSerializer
        return ItemCopySerializer

    def create(self, request, *args, **kwargs):
        print("Received data:", request.data)
        data_array = request.data if isinstance(request.data, list) else [request.data]
        response_data = []

        for data_item in data_array:
            profile_item_id = data_item.get('inventory')

            try:
                inventory = Inventory.objects.get(item=profile_item_id)
            except Inventory.DoesNotExist:
                return Response({"error": "Inventory not found for the given item ID"}, status=status.HTTP_404_NOT_FOUND)

            if not inventory.item.returnable:
                return Response({"error": "Item is non-returnable and cannot have copies"}, status=status.HTTP_400_BAD_REQUEST)

            data_item['inventory'] = inventory.id
            response_data.append(data_item)

        # Save each item copy to the database
        saved_copies = []
        for data_item in response_data:
            copy_serializer = self.get_serializer(data=data_item)
            if copy_serializer.is_valid():
                copy_instance = copy_serializer.save()
                saved_copies.append(copy_serializer.data)
                print(f"Saved ItemCopy with ID {copy_instance.id}")

        # Return a JSON response with the created item copies
        print("Saved Item Copies:", saved_copies)
        return Response({"item_copies": saved_copies}, status=status.HTTP_201_CREATED)


class EditItemCopyStatusViewSet(viewsets.ModelViewSet):
    queryset = ItemCopy.objects.all()
    serializer_class = ItemCopySerializer

    def get_object(self):
        return get_object_or_404(ItemCopy, inventory__id=self.kwargs['inventory_id'], id=self.kwargs['item_id'])

class InventoryPagination(PageNumberPagination):
    page_size = 30
    page_size_query_param = 'page_size'
    max_page_size = 1000

class InventoryViewSet(viewsets.ModelViewSet):
    queryset = Inventory.objects.all()
    pagination_class = InventoryPagination
    filter_backends = [filters.SearchFilter]
    search_fields = ['item__name']

    def get_queryset(self):
        queryset = super().get_queryset().order_by('id')
        search_query = self.request.query_params.get('search', None)
        category_filter = self.request.query_params.get('search_category', None)

        if category_filter:
            # If category_filter is provided, filter items based on the category name
            queryset = queryset.filter(item__category__name__icontains=category_filter)
        elif search_query:
            # Apply search filter if search_query is provided
            queryset = queryset.filter(
                Q(item__name__icontains=search_query) |
                Q(item__category__name__icontains=search_query)
            )

        return queryset

    #Different Serializer for Creation
    def get_serializer_class(self):
        if self.action == 'create':
            return InventoryCreateSerializer
        return InventorySerializer

    def create(self, request, *args, **kwargs):
        response_data = []

        for data_item in request.data:
            serializer = self.get_serializer(data=data_item)
            serializer.is_valid(raise_exception=True)

            item_id = data_item.get("item")
            quantity_to_add = serializer.validated_data.get("quantity", 0)

            inventory_instance, created = Inventory.objects.get_or_create(item_id=item_id, defaults={"quantity": 0})
            inventory_instance.quantity += quantity_to_add
            inventory_instance.save()

            response_data.append(InventorySerializer(inventory_instance).data)

        return Response(response_data, status=status.HTTP_201_CREATED)