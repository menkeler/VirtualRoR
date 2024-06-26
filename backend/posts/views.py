from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework import status
from .models import Post
from .serializers import PostSerializer, PostCreateSerializer
from rest_framework.pagination import PageNumberPagination
from rest_framework.decorators import action

class PostPagination(PageNumberPagination):
    page_size = 30
    page_size_query_param = 'page_size'
    max_page_size = 1000
    
class PostViewSet(viewsets.ModelViewSet):
    queryset = Post.objects.all()   
    pagination_class = PostPagination

    def get_serializer_class(self):
        if self.action == 'create':
            return PostCreateSerializer
        return PostSerializer
    
    def create(self, request, *args, **kwargs):
        serializer = PostCreateSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    
    def get_queryset(self):
        queryset = Post.objects.all()
        status = self.request.query_params.get('status', None)
        category_param = self.request.query_params.get('category', None)
        search_param = self.request.query_params.get('search', None)
        user_param = self.request.query_params.get('user', None)

        if status:
            queryset = queryset.filter(status__iexact=status)
        if category_param:
            queryset = queryset.filter(category__iexact=category_param)
        if search_param:
            queryset = queryset.filter(title__icontains=search_param)
        if user_param:
            queryset = queryset.filter(author=user_param)

        return queryset.all().order_by('-id')
        # if want random use below
        # return queryset.order_by('?')
    
    @action(detail=False, methods=['GET'])
    def latest_post(self, request):
        latest_post = Post.objects.latest('created_at')  # Assuming 'created_at' is the field indicating the creation timestamp
        serializer = self.get_serializer(latest_post)
        return Response(serializer.data)
    
    