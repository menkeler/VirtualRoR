from django.urls import path
from . import views

urlpatterns = [
    #categories
    path('categories/', views.HandleCategory.as_view(), name='category-list'),
    #Item Profiling
    path('itemprofilings/', views.HandleItemProfiling.as_view(), name='itemprofiling-list'),
    path('itemprofilings/<int:id>/', views.HandleItemProfiling.as_view(), name='item-profiling-detail'),
    #Item Copies
    path('itemcopies/', views.HandleItemCopy.as_view(), name='itemcopy-list'),
    path('itemcopies/<int:inventory_id>/', views.HandleItemCopy.as_view(), name='itemcopy-details'),
    path('itemcopies/<int:inventory_id>/<int:item_id>/', views.EditItemCopyStatus.as_view(), name='edit-item-copy-status'),
    #Inventory 
    path('inventories/', views.HandleInventory.as_view(), name='inventory-list'),
]
