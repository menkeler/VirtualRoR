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
    DepartmentSerializer,
    CreateUserSerializer
)
from .models import User, Staff,Department
from rest_framework.pagination import PageNumberPagination


class UserPagination(PageNumberPagination):
    page_size = 30
    page_size_query_param = 'page_size'
    max_page_size = 1000
    
class DepartmentViewSet(viewsets.ModelViewSet):
    serializer_class = DepartmentSerializer
    queryset = Department.objects.all()
    
class UserViewSet(viewsets.ModelViewSet):
    # permission_classes = [permissions.IsAuthenticated]
    queryset = User.objects.all().order_by('user_id')
    pagination_class = UserPagination
    filter_backends = [filters.SearchFilter]
    search_fields = ['first_name', 'last_name']
    
    def get_serializer_class(self):
        if self.action == 'partial_update':
            return CreateUserSerializer
        return UserSerializer

    
    def get_queryset(self):
        queryset = super().get_queryset()
        return queryset
    
    @action(detail=False, methods=['GET'])
    def newest_user(self, request):
        newest_user = User.objects.latest('user_id')  # Assuming 'user_id' is the field indicating the user ID
        serializer = self.get_serializer(newest_user)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def total_users_count(self, request):
        total_users_count = self.get_queryset().count()
        return Response({'total_users_count': total_users_count}, status=status.HTTP_200_OK)

    @action(detail=False, methods=['post'], permission_classes=[AllowAny])
    def register(self, request):
        serializer = UserRegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.create(request.data)
        response_data = {
            'user_id': user.user_id,
            'first_name': user.first_name,
            'last_name': user.last_name,
            'email': user.email,
            'contact': user.contact,
            'department': user.department,
            'date_joined': user.date_joined,
        }
        if user.department:
            department_data = DepartmentSerializer(user.department).data
            response_data['department'] = department_data
        else:
            response_data['department'] = None

        return Response(response_data, status=status.HTTP_201_CREATED)
    
    @action(detail=False, methods=['post'], permission_classes=[AllowAny])
    def checkregister(self, request):
        email = request.data.get('email', None)
        user_exists = User.objects.filter(email=email).exists()
        print(f"Checking registration for email: {email}")
        print(f"User exists: {user_exists}")
        if user_exists:
            return Response({'detail': 'User already registered'}, status=status.HTTP_200_OK)
        else:
            return Response({'detail': 'User not registered'}, status=status.HTTP_202_ACCEPTED)   
            
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
            # Clear the user's session
            request.session.flush()
            return Response({'detail': 'Logout successful'}, status=status.HTTP_200_OK)
        else:
            return Response({'detail': 'User not authenticated'}, status=status.HTTP_401_UNAUTHORIZED)

         
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

