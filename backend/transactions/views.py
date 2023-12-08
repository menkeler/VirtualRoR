from .models import Inquiry,Transaction, TransactionItem,ReservedItem
from .serializers import InquirySerializer,TransactionSerializer, TransactionItemSerializer,ReservedItemSerializer


from rest_framework import viewsets

class InquiryViewSet(viewsets.ModelViewSet):
    queryset = Inquiry.objects.all()
    serializer_class = InquirySerializer

class TransactionViewSet(viewsets.ModelViewSet):
    queryset = Transaction.objects.all()
    serializer_class = TransactionSerializer

class ReservedItemViewSet(viewsets.ModelViewSet):
    queryset = ReservedItem.objects.all()
    serializer_class = ReservedItemSerializer

class TransactionItemViewSet(viewsets.ModelViewSet):
    queryset = TransactionItem.objects.all()
    serializer_class = TransactionItemSerializer