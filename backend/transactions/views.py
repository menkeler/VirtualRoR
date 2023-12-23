from .models import Inquiry,Transaction, TransactionItem,ReservedItem
from .serializers import InquirySerializer,InquiryCreateSerializer,TransactionSerializer, TransactionItemSerializer,ReservedItemSerializer,ReservedItemCreateSerializer,CreateTransactionItemSerializer,CreateTransactionSerializer
from rest_framework.response import Response
from rest_framework import status
from rest_framework import viewsets
from rest_framework.pagination import PageNumberPagination
from django.db.models import Q
from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view
from django.utils import timezone

class InquiryPagination(PageNumberPagination):
    page_size = 50
    page_size_query_param = 'page_size'
    max_page_size = 1000
    
class InquiryViewSet(viewsets.ModelViewSet):
    queryset = Inquiry.objects.all()
    pagination_class = InquiryPagination
    ordering_fields = ['status']

    def get_serializer_class(self):
        if self.action == 'create':
            return InquiryCreateSerializer
        return InquirySerializer

    def get_queryset(self):
        queryset = super().get_queryset()

        # Get the 'ordering', 'status', 'type', and 'purpose' query parameters from the request
        ordering = self.request.query_params.get('ordering', 'status')
        status = self.request.query_params.get('status', None)
        type_param = self.request.query_params.get('type', None)

        # Validate the ordering parameter to prevent injection attacks
        if ordering not in self.ordering_fields:
            ordering = 'status'

        # Apply ordering to the queryset
        queryset = queryset.order_by(f'{ordering}')

        # Filter by status if provided
        if status:
            queryset = queryset.filter(status=status)

        # Filter by type if provided
        if type_param:
            queryset = queryset.filter(inquiry_type=type_param)
            

        return queryset
    
    
class TransactionPagination(PageNumberPagination):
    page_size = 50
    page_size_query_param = 'page_size'
    max_page_size = 1000
class TransactionViewSet(viewsets.ModelViewSet):
    queryset = Transaction.objects.all()
    pagination_class = TransactionPagination

    def get_serializer_class(self):
        if self.action == 'create':
            return CreateTransactionSerializer
        return TransactionSerializer

class ReservedItemViewSet(viewsets.ModelViewSet):
    queryset = ReservedItem.objects.all()

    def get_serializer_class(self):
        if self.action == 'create':
            return ReservedItemCreateSerializer
        return ReservedItemSerializer

    def create(self, request, *args, **kwargs):
        # Assuming the data is passed directly in the request
        data_list = request.data

        # Validate each item in the list and create instances
        created_items = []
        for data in data_list:
            serializer = self.get_serializer(data=data)
            serializer.is_valid(raise_exception=True)
            self.perform_create(serializer)
            created_items.append(serializer.data)

        return Response(created_items, status=status.HTTP_201_CREATED)


class TransactionItemViewSet(viewsets.ModelViewSet):
    queryset = TransactionItem.objects.all()
    
    def get_serializer_class(self):
        if self.action == 'create':
            return CreateTransactionItemSerializer
        return TransactionItemSerializer
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data, many=isinstance(request.data, list))
        # Print request data for debugging
        print("Request Data:", request.data)
        
        serializer.is_valid(raise_exception=True)
        # Print validated data for debugging
        print("Validated Data:", serializer.validated_data)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
    
@api_view(['POST'])
def confirm_reservation(request, inquiry_id, purpose):
    inquiry = get_object_or_404(Inquiry, pk=inquiry_id)

    # Check if the inquiry is of type 'Reservation' and has a status of 'Pending'
    if purpose == 'Accept':
        if inquiry.inquiry_type == 'Reservation' and inquiry.status == 'Pending':
            # Update the inquiry status to 'Accepted'
            inquiry.status = 'Accepted'
            inquiry.save()

            # Process each reserved item
            for reserved_item in inquiry.reserved_items.all():
                # Check if the item is an ItemCopy
                if hasattr(reserved_item, 'item') and reserved_item.item:
                    # Update is_borrowed status to True
                    reserved_item.item.is_borrowed = True
                    reserved_item.item.save()
                elif hasattr(reserved_item, 'inventory') and reserved_item.inventory:
                    # Check if the item is related to an inventory item and it exists
                    
                    # Calculate the available quantity to reserve
                    available_quantity = min(reserved_item.inventory.quantity, reserved_item.quantity)

                    # Update the inventory quantity
                    reserved_item.inventory.quantity -= available_quantity
                    reserved_item.inventory.save()  

            # Serialize the updated inquiry
            serializer = InquirySerializer(inquiry)
            return Response(serializer.data, status=status.HTTP_200_OK)
        
        elif inquiry.inquiry_type == 'Donation' and inquiry.status == 'Pending':
            inquiry.status = 'Accepted'
            inquiry.save()
            
            # Serialize the updated inquiry
            serializer = InquirySerializer(inquiry)
            return Response(serializer.data, status=status.HTTP_200_OK)
        
    elif purpose == 'Rejected':
        # Extra commands in  the future
        inquiry.status = 'Rejected'
        inquiry.save()
         # Serialize the updated inquiry
        serializer = InquirySerializer(inquiry)
        return Response(serializer.data, status=status.HTTP_200_OK)
    elif purpose == 'Cancelled':
        
        inquiry.status = 'Cancelled'
        inquiry.save()
         # Serialize the updated inquiry
        serializer = InquirySerializer(inquiry)
        return Response(serializer.data, status=status.HTTP_200_OK)
        
        
    return Response({'detail': 'Reservation cannot be confirmed.'}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def process_transaction(request, inquiry_id):
    # Retrieve the inquiry
    inquiry = get_object_or_404(Inquiry, pk=inquiry_id)

    # Check if the inquiry is of type 'Reservation' and has a status of 'Accepted'
    if inquiry.inquiry_type == 'Reservation' and inquiry.status == 'Accepted':
        # Extract additional data from the request body
        remarks = request.data.get('remarks', '')

        # Create a Transaction with the participant as the inquirer
        transaction = Transaction.objects.create(
            inquiry=inquiry,
            participant=inquiry.inquirer,
            transaction_type='Release',
            remarks=remarks
        )

        # Process each reserved item in the transaction
        for reserved_item in inquiry.reserved_items.all():
            # Create a transaction item based on the reserved item type
            if hasattr(reserved_item, 'item'):
                # For ItemCopy
                transaction_item = TransactionItem.objects.create(
                    transaction=transaction,
                    item=reserved_item.item,
                    quantity=1,
                    status="Active" 
                )
            else:
                # For regular Inventory item
                transaction_item = TransactionItem.objects.create(
                    transaction=transaction,
                    inventory=reserved_item.inventory,
                    quantity=reserved_item.quantity,
                    status="Consumable" 
                )

        # Update the inquiry status to 'Processed'
        inquiry.status = 'Processed'
        inquiry.save()

        # Clear reserved items
        inquiry.reserved_items.all().delete()


        # Return a response indicating a successful transaction
        return Response({'detail': 'Transaction processed successfully.'}, status=status.HTTP_200_OK)

    return Response({'detail': 'Transaction cannot be processed.'}, status=status.HTTP_400_BAD_REQUEST)