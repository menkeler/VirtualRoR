from django.db.models import Count, Q,Sum
from django.utils import timezone
from django.shortcuts import get_object_or_404
from rest_framework import viewsets, status
from rest_framework.decorators import action, api_view
from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response
from .models import Inquiry, Transaction, TransactionItem, ReservedItem
from users.models import User
from inventory.models import ItemCopy , Inventory
from django.db.models.signals import post_save
from django.dispatch import receiver
from .serializers import (
    InquirySerializer, InquiryCreateSerializer,
    TransactionSerializer, TransactionItemSerializer,
    ReservedItemSerializer, ReservedItemCreateSerializer,
    CreateTransactionItemSerializer, CreateTransactionSerializer
)
from django.db import transaction
from django.core.exceptions import ValidationError
from .utils import cancel_reserved_items

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

        # Get the query parameters from the request
        ordering = self.request.query_params.get('ordering', 'status')
        status = self.request.query_params.get('status', None)
        type_param = self.request.query_params.get('type', None)
        search_param = self.request.query_params.get('search', None)
        user_param = self.request.query_params.get('user', None)

        # Validate the ordering parameter to prevent injection attacks
        if ordering not in self.ordering_fields:
            ordering = 'status'

        # Apply ordering to the queryset
        queryset = queryset.order_by(ordering)

        # Filter by status if provided
        if status:
            queryset = queryset.filter(status=status)

        # Filter by type if provided
        if type_param:
            queryset = queryset.filter(inquiry_type=type_param)
       
        # Filter by inquirer if provided
        if user_param:
            queryset = queryset.filter(inquirer=user_param)
  
        # Filter by inquirer name if provided
        if search_param:
            queryset = queryset.filter(Q(inquirer__first_name__icontains=search_param) | Q(inquirer__last_name__icontains=search_param))

        return queryset.all().order_by('-id')

    @action(detail=False, methods=['GET'])
    def latest_inquiry(self, request):
        latest_inquiry = Inquiry.objects.latest('id')  # Assuming 'created_at' is the field indicating the creation timestamp
        serializer = self.get_serializer(latest_inquiry)
        return Response(serializer.data)
 
    
class TransactionPagination(PageNumberPagination):
    page_size = 50
    page_size_query_param = 'page_size'
    max_page_size = 1000
    
class TransactionViewSet(viewsets.ModelViewSet):
    queryset = Transaction.objects.all()
    pagination_class = TransactionPagination
    ordering_fields = ['is_active', 'purpose']

    def get_serializer_class(self):
        if self.action == 'create':
            return CreateTransactionSerializer
        return TransactionSerializer
   
    @action(detail=False, methods=['GET'])
    def total_transactions(self, request):
        total_transactions = self.get_queryset().count()
        return Response({'total_transactions': total_transactions}, status=status.HTTP_200_OK)
    
    @action(detail=False, methods=['GET'])
    def latest_transaction(self, request):
        latest_transaction = Transaction.objects.latest('id')  # Assuming 'created_at' is the field indicating the creation timestamp
        serializer = self.get_serializer(latest_transaction)
        return Response(serializer.data)
 
    
    @action(detail=False, methods=['GET'])
    def total_donations_this_month(self, request):
        # Get the current month and year
        current_month = timezone.now().month
        current_year = timezone.now().year

        # Filter transactions for the current month, with transaction_type='Donation'
        donations_this_month = TransactionItem.objects.filter(
            transaction__date_created__month=current_month,
            transaction__date_created__year=current_year,
            transaction__transaction_type='Donation'
        )

        # Aggregate the total quantity of all donated items per user
        user_donation_data_list = donations_this_month.values(
            'transaction__participant',
            'transaction__participant__first_name',
            'transaction__participant__last_name',
            'transaction__participant__email',
            'transaction__participant__avatar',
        ).annotate(
            total_quantity_donated=Sum('quantity')
        ).order_by('-total_quantity_donated')[:10]  # Order by total quantity donated and select top 10

        # Include user details (assuming participant is a ForeignKey to User model)
        user_donation_data = [
            {
                'id': entry['transaction__participant'],
                'first_name': entry['transaction__participant__first_name'],
                'last_name': entry['transaction__participant__last_name'],
                'email': entry['transaction__participant__email'],
                'avatar': entry['transaction__participant__avatar'],
                'total_quantity_donated': entry['total_quantity_donated']
            }
            for entry in user_donation_data_list
        ]
    
        return Response({'user_donation_data': user_donation_data}, status=status.HTTP_200_OK)

    
    def get_queryset(self):
        queryset = super().get_queryset()

        # Get the 'ordering', 'type', and 'search' query parameters from the request
        ordering = self.request.query_params.get('ordering', 'is_active')
        type_param = self.request.query_params.get('type', None)
        search_param = self.request.query_params.get('search', None)
        is_active_param = self.request.query_params.get('is_active', None)
        user_param = self.request.query_params.get('user', None)
        # Validate the ordering parameter to prevent injection attacks
        if ordering not in self.ordering_fields:
            ordering = 'is_active'

        # Apply ordering to the queryset
        queryset = queryset.order_by(f'{ordering}')

        # Filter by type if provided
        if type_param:
          queryset = queryset.filter(transaction_type__icontains=type_param)


        # Filter by is_active if provided
        if is_active_param is not None and is_active_param != '':
            # Convert the string 'true' or 'false' to a boolean value
            is_active_value = is_active_param.lower() == 'true'
            queryset = queryset.filter(is_active=is_active_value)

        # Filter by inquirer if provided
        if user_param:
            queryset = queryset.filter(participant=user_param)

        # Filter by inquirer name if provided
        if search_param:
            queryset = queryset.filter(
                Q(participant__first_name__icontains=search_param) | Q(participant__last_name__icontains=search_param)
            )

        return queryset.all().order_by('-id')

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
    # IF Inquiry change status
    if purpose == 'Accept':
        if inquiry.status == 'Pending':
            inquiry.status = 'Accepted'
            if inquiry.inquiry_type == 'Donation':
                inquiry.save()
            else:
                try:
                    process_reserved_items(inquiry)
                except ValidationError as e:
                    inquiry.status = 'Rejected'
                    inquiry.save()
                    return Response({'detail': str(e)}, status=status.HTTP_200_OK)
                
                inquiry.save()
            return Response(InquirySerializer(inquiry).data, status=status.HTTP_200_OK)
        
    elif purpose == 'Rejected':
        inquiry.status = 'Rejected'
        inquiry.save()
        return Response(InquirySerializer(inquiry).data, status=status.HTTP_200_OK)
    
    elif purpose == 'Cancelled':
        inquiry.status = 'Cancelled'
        inquiry.save()
        return Response(InquirySerializer(inquiry).data, status=status.HTTP_200_OK)
    
    return Response({'detail': 'Reservation cannot be confirmed.'}, status=status.HTTP_400_BAD_REQUEST)

#if Resereved item is borrowable which is item is the same as itemCopy status for borrwed
def process_reserved_items(inquiry):
    for reserved_item in inquiry.reserved_items.all():
        if hasattr(reserved_item, 'item') and reserved_item.item:
            if reserved_item.item.is_reserved or reserved_item.item.is_borrowed:
                raise ValidationError("Error: Item is already borrowed.")
            else:
                reserved_item.item.is_reserved = True
                reserved_item.item.save()

        elif hasattr(reserved_item, 'inventory') and reserved_item.inventory:
            available_quantity = reserved_item.inventory.quantity
            if reserved_item.inventory.reserved_quantity + reserved_item.quantity > available_quantity:
                raise ValidationError("Error: Reserved quantity exceeds available quantity.")
            
            reserved_item.inventory.reserved_quantity += reserved_item.quantity
            reserved_item.inventory.save()




@api_view(['POST'])
def process_transaction(request,transaction_type=None):
    # Extract data from the request body
    transaction_items = request.data.get('transaction_items', [])
    remarks = request.data.get('remarks', '')
    user_id = request.data.get('user_id')  # Change variable name to user_id for clarity
    inquiry_id = request.data.get('inquiry') 
    returnDate = request.data.get('return_date') 
    try:
        # Retrieve the User object based on the user_id
        user = User.objects.get(pk=user_id)
    except User.DoesNotExist:
        return Response({'detail': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

    if not inquiry_id:
        inquiry = None
    else:
        inquiry = get_object_or_404(Inquiry, pk=inquiry_id)
        
        
    # Initialize transaction variable
    transaction_instance = None
    
    try:
        
        # Begin transaction
        with transaction.atomic():
            # Create a Transaction without associating it with any specific inquiry
            if inquiry_id is not None:
                cancel_reserved_items(inquiry_id)  # deletes reserved items
                is_active = False
                inquiry.status = 'Processed'  # Mark inquiry as processed
                inquiry.save()
                transaction_instance = Transaction.objects.create(
                    inquiry=inquiry,
                    participant=inquiry.inquirer,
                    transaction_type=transaction_type,
                    remarks=remarks,
                    return_date=returnDate
                )
                
            else:
                transaction_instance = Transaction.objects.create(
                    inquiry=None,
                    participant=user,
                    transaction_type=transaction_type,
                    remarks=remarks,
                    return_date=returnDate
                )
                
                

                is_active = False
    
            # Process each transaction item
            for item_data in transaction_items:
                # Assuming item_data contains the necessary information for creating TransactionItem
                item = item_data.get('item')
                if item is not None:
                    # Retrieve the ItemCopy instance based on the primary key provided in item_data
                    try:
                        item_copy = ItemCopy.objects.get(pk=item['id'])
                    except ItemCopy.DoesNotExist:
                        raise ValidationError({'detail': 'ItemCopy not found'})

                    # Update the borrowed status of the ItemCopy
                    if item_copy.is_borrowed:
                        raise ValidationError({'detail': 'Item is already borrowed.'})

                    item_copy.previous_is_borrowed = item_copy.is_borrowed
                    item_copy.is_borrowed = True
                    item_copy.save()

                    # For ItemCopy
                    transaction_item = TransactionItem.objects.create(
                        transaction=transaction_instance,
                        item=item_copy,
                        quantity=item_data.get('quantity', 1),  # Default to 1 if quantity is not provided
                        status="Active"
                    )
                    if transaction_type == "Maintenance":
                        is_active = False
                    else:
                        is_active = True
                else:
                    # Extract the inventory ID from the dictionary
                    inventory_id = item_data['inventory']['id']

                    try:
                        # Retrieve the Inventory instance based on the provided inventory_id
                        inventory_instance = Inventory.objects.get(pk=inventory_id)
                    except Inventory.DoesNotExist:
                        raise ValidationError({'detail': f'Inventory with ID {inventory_id} does not exist.'})

                    # Now that you have the Inventory instance, you can create the TransactionItem
                    transaction_item = TransactionItem.objects.create(
                        transaction=transaction_instance,
                        inventory=inventory_instance,  # Assign the Inventory instance, not just the ID
                        quantity=item_data.get('quantity', 1),
                        status="Consumable"
                    )

                    # Calculate the available quantity for subtraction
                    available_quantity = min(inventory_instance.quantity, transaction_item.quantity)
                    inventory_instance.quantity -= available_quantity
                    inventory_instance.save()

            # If no exceptions were raised during transaction processing, commit the transaction
            transaction_instance.is_active = is_active
            transaction_instance.save()
        serializer = TransactionSerializer(transaction_instance)
        # Return a response indicating a successful transaction
        return Response(serializer.data, status=status.HTTP_200_OK)

    except ValidationError as e:
        if transaction_instance:
            # Rollback the transaction if a validation error occurs
            transaction_instance.delete()
        return Response(e.message_dict, status=status.HTTP_400_BAD_REQUEST)
