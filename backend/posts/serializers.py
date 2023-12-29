from rest_framework import serializers
from .models import Post
from users.serializers import UserSerializer 



class PostSerializer(serializers.ModelSerializer):
    author= UserSerializer()
    class Meta:
        model = Post
        fields = '__all__'
        
class PostCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = '__all__'        
        