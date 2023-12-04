from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Inquiry,Transaction, TransactionItem
from .serializers import InquirySerializer,TransactionSerializer, TransactionItemSerializer
from rest_framework.generics import RetrieveUpdateAPIView
class InquiryView(APIView):
    def post(self, request):
        # Handle POST request to create a new inquiry
        serializer = InquirySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def get(self, request):
        # Handle GET request to retrieve all inquiries
        inquiries = Inquiry.objects.all()
        serializer = InquirySerializer(inquiries, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
class TransactionView(APIView):
    def post(self, request):
        # Handle POST request to create a new transaction
        serializer = TransactionSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def get(self, request):
        # Handle GET request to retrieve all transactions
        transactions = Transaction.objects.all()
        serializer = TransactionSerializer(transactions, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
#Handle Individual Transaction based on id    
class SingleTransactionView(RetrieveUpdateAPIView):
    queryset = Transaction.objects.all()
    serializer_class = TransactionSerializer

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        return Response(serializer.data)



class TransactionItemView(APIView):
    def post(self, request):
        # Handle POST request to create a new transaction item
        serializer = TransactionItemSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def get(self, request):
        # Handle GET request to retrieve all transaction items
        transaction_items = TransactionItem.objects.all()
        serializer = TransactionItemSerializer(transaction_items, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)