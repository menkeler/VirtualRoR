from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Inquiry,Transaction, TransactionItem
from .serializers import InquirySerializer,TransactionSerializer, TransactionItemSerializer

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