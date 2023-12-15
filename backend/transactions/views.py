from .models import Inquiry,Transaction, TransactionItem,ReservedItem
from .serializers import InquirySerializer,TransactionSerializer, TransactionItemSerializer,ReservedItemSerializer,CreateTransactionItemSerializer,CreateTransactionSerializer

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