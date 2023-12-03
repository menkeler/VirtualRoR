from django.urls import path
from . import views

urlpatterns = [
    path('categories/', views.HandleCategory.as_view(), name='category-list'),
    path('itemprofilings/', views.HandleItemProfiling.as_view(), name='itemprofiling-list'),
    path('itemcopies/', views.HandleItemCopy.as_view(), name='itemcopy-list'),
    path('inventories/', views.HandleInventory.as_view(), name='inventory-list'),
]
