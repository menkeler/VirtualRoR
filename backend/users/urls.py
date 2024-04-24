from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views


router = DefaultRouter()
router.register('users', views.UserViewSet, basename='user')
router.register('departments', views.DepartmentViewSet, basename='department')
urlpatterns = [
    path('', include(router.urls)),
    
]