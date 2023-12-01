from django.contrib.auth import  login, logout
from rest_framework.authentication import TokenAuthentication
from rest_framework.authtoken.models import Token
from rest_framework.views import APIView
from rest_framework.response import Response
from .serializers import UserRegisterSerializer, UserLoginSerializer, UserSerializer
from rest_framework import permissions, status
from django.shortcuts import get_object_or_404
from .models import User


class UserRegister(APIView):
    permission_classes = (permissions.AllowAny,)
    def post(self, request):
        data = request.data
        serializer = UserRegisterSerializer(data=data)
        if serializer.is_valid(raise_exception=True):
            user = serializer.create(data)
            if user:
                return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(status=status.HTTP_400_BAD_REQUEST)


class UserLogin(APIView):
    permission_classes = (permissions.AllowAny,)
    authentication_classes = (TokenAuthentication,)

    def post(self, request):
        data = request.data
        serializer = UserLoginSerializer(data=data)
        if serializer.is_valid(raise_exception=True):
            user = serializer.check_user(data)

            # Create or retrieve an existing token for the user
            token, created = Token.objects.get_or_create(user=user)

            login(request, user)

            # Return the user data along with the token
            return Response({'user': serializer.data, 'token': token.key}, status=status.HTTP_200_OK)



class UserLogout(APIView):
    permission_classes = (permissions.IsAuthenticated,)
    

    def post(self, request):
        # Check if the user is authenticated
        if request.user.is_authenticated:
            # Logout the user
            print("Before logout:", request.user)  # Add this line
            try:
                token = Token.objects.get(user=request.user)
                token.delete()
                print("Token deleted successfully")
            except Token.DoesNotExist:
                print("Token does not exist")
            logout(request)
            print("After logout:", request.user)  # Add this line

            # Delete the user's token if it exists

            return Response({'detail': 'Logout successful'}, status=status.HTTP_200_OK)
        else:
            return Response({'detail': 'User not authenticated'}, status=status.HTTP_401_UNAUTHORIZED)



class UserView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request, id=None): 
        if id is not None:
            user = get_object_or_404(User, user_id=id)
        else:
            # If 'id' is not provided, return the profile of the current user
            user = request.user

        serializer = UserSerializer(user)
        return Response({'user': serializer.data}, status=status.HTTP_200_OK)
    
class UserViewAll(APIView):
    permission_classes = (permissions.IsAuthenticated,)
    def get(self, request, id=None):
        users = User.objects.all()
        serializer = UserSerializer(users, many=True)
        return Response({'users': serializer.data}, status=status.HTTP_200_OK)


class UserCheckRegister(APIView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request):
        data = request.data
        # Only used UserLoginSerializer to retrieve Registered Emails
        serializer = UserLoginSerializer(data=data)
        if serializer.is_valid(raise_exception=True):
            user = serializer.check_user(data)
            print(f"User logged in: {user.email}")
            return Response(serializer.data, status=status.HTTP_200_OK)
