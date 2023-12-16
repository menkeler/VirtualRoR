from .models import Inquiry,Transaction, TransactionItem,ReservedItem
from .serializers import InquirySerializer,TransactionSerializer, TransactionItemSerializer,ReservedItemSerializer,CreateTransactionItemSerializer,CreateTransactionSerializer
from rest_framework.response import Response
from rest_framework import status
from rest_framework import viewsets

class InquiryViewSet(viewsets.ModelViewSet):
    queryset = Inquiry.objects.all()
    serializer_class = InquirySerializer

class TransactionViewSet(viewsets.ModelViewSet):
    queryset = Transaction.objects.all()

    def get_serializer_class(self):
        if self.action == 'create':
            return CreateTransactionSerializer
        return TransactionSerializer

class ReservedItemViewSet(viewsets.ModelViewSet):
    queryset = ReservedItem.objects.all()
    serializer_class = ReservedItemSerializer

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
