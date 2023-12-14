from django.contrib.auth import login, logout
from rest_framework import viewsets, permissions, status, filters
from rest_framework.authentication import TokenAuthentication
from rest_framework.authtoken.models import Token
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from .serializers import (
    UserRegisterSerializer,
    UserLoginSerializer,
    UserSerializer,
    StaffSerializer,
)
from .models import User, Staff
from rest_framework.pagination import PageNumberPagination


class UserPagination(PageNumberPagination):
    page_size = 30
    page_size_query_param = 'page_size'
    max_page_size = 1000

class UserViewSet(viewsets.ModelViewSet):
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]
    queryset = User.objects.all().order_by('user_id')
    pagination_class = UserPagination
    filter_backends = [filters.SearchFilter]
    search_fields = ['first_name', 'last_name']
    
    def get_queryset(self):
        queryset = super().get_queryset()
        # Additional filtering based on your requirements
        # You can customize this further based on your needs
        return queryset

    @action(detail=False, methods=['post'], permission_classes=[AllowAny])
    def register(self, request):
        serializer = UserRegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.create(request.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    @action(detail=False, methods=['post'], permission_classes=[AllowAny])
    def checkregister(self, request):
        email = request.data.get('email', None)
        user_exists = User.objects.filter(email=email).exists()

        if user_exists:
            return Response({'detail': 'User already registered'}, status=status.HTTP_200_OK)
        else:
            return Response({'detail': 'User not registered'}, status=status.HTTP_200_OK)   
            
    @action(detail=False, methods=['post'], permission_classes=[AllowAny])
    def login(self, request):
        serializer = UserLoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.check_user(request.data)
        token, created = Token.objects.get_or_create(user=user)
        login(request, user)
        return Response({'user': serializer.data, 'token': token.key}, status=status.HTTP_200_OK)

    @action(detail=False, methods=['post'])
    def logout(self, request):
        if request.user.is_authenticated:
            try:
                token = Token.objects.get(user=request.user)
                token.delete()
            except Token.DoesNotExist:
                pass
            logout(request)
            return Response({'detail': 'Logout successful'}, status=status.HTTP_200_OK)
        else:
            return Response({'detail': 'User not authenticated'}, status=status.HTTP_401_UNAUTHORIZED)

    @action(detail=True, methods=['put'])
    def edit_user(self, request, pk=None):
        user = self.get_object()
        serializer = UserSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
         
    @action(detail=True, methods=['post'])
    def become_staff(self, request, pk=None):
        try:
            user = self.get_object()
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

        if Staff.objects.filter(user=user).exists():
            return Response({"error": "User is already a staff"}, status=status.HTTP_400_BAD_REQUEST)

        staff = Staff.objects.create(user=user, position="Program Officer")
        serializer = StaffSerializer(staff)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['delete'])
    def remove_staff(self, request, pk=None):
        try:
            user = self.get_object()
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

        try:
            staff = Staff.objects.get(user=user)
        except Staff.DoesNotExist:
            return Response({"error": "User not found in staff"}, status=status.HTTP_404_NOT_FOUND)

        staff.delete()
        return Response({"message": "User removed from staff"}, status=status.HTTP_200_OK)
    
    @action(detail=False, methods=['get'])
    def get_logged_in_user_details(self, request):
        user = request.user
        serializer = UserSerializer(user)
        return Response({'user': serializer.data}, status=status.HTTP_200_OK)

