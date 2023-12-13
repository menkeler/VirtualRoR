from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status,viewsets, filters
from .models import Category, ItemProfiling, ItemCopy, Inventory
from .serializers import CategorySerializer, ItemProfilingSerializer, ItemCopySerializer, InventorySerializer,InventoryCreateSerializer,ItemProfilingCreateSerializer
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
    serializer_class = ItemProfilingSerializer
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
    serializer_class = ItemCopySerializer

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
    serializer_class = InventorySerializer
    pagination_class = InventoryPagination
    filter_backends = [filters.SearchFilter]
    search_fields = ['item__name']

    def get_queryset(self):
        queryset = super().get_queryset()
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
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        item_id = request.data.get("item")
        quantity_to_add = serializer.validated_data.get("quantity", 0)

        inventory_instance, created = Inventory.objects.get_or_create(item_id=item_id, defaults={"quantity": 0})
        inventory_instance.quantity += quantity_to_add
        inventory_instance.save()

        response_serializer = InventorySerializer(inventory_instance)
        return Response(response_serializer.data, status=status.HTTP_201_CREATED)