from rest_framework import serializers
from django.contrib.auth import get_user_model, authenticate
from rest_framework.serializers import ValidationError
from .models import Staff ,Department,User



UserModel = get_user_model()


        
        
class UserRegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserModel
        fields = ['first_name', 'last_name', 'email', 'contact', 'department']


    def create(self, data):
        # Check if contact and department are provided in the data
        contact = data.get('contact')
        department = data.get('department')
        
        # Create the user with required fields
        user = UserModel.objects.create_user(
            email=data['email'],
            first_name=data['first_name'],
            last_name=data['last_name'],
            is_staff=False  # Set the is_staff field
        )
        
        # Assign optional fields if provided
        if contact is not None:
            user.contact = contact
        if department is not None:
            try:
                department = Department.objects.get(id=department)
                user.department = department
            except Department.DoesNotExist:
                # Handle case where department with the provided ID doesn't exist
                pass
            
        user.save()  
        
        return user


class UserLoginSerializer(serializers.Serializer):
    email = serializers.EmailField()

    def check_user(self, data):
        try:
            user = UserModel.objects.get(email=data['email'])
        except UserModel.DoesNotExist:
            raise ValidationError('User not found')
        return user

#retrieve data from table
class StaffSerializer(serializers.ModelSerializer):
    class Meta:
        model = Staff
        fields = '__all__'  
        
class DepartmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Department
        fields = '__all__'  
        
class UserSerializer(serializers.ModelSerializer):
    staff = StaffSerializer()
    department = DepartmentSerializer(read_only=True)
    class Meta:
        model = UserModel
        exclude = ['password']

class CreateUserSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = User
        exclude = ['password']
        
        
        