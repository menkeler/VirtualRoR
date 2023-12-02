from django.urls import path
from . import views

urlpatterns = [
	path('inventoryItemsProfile', views.ViewItems.as_view(), name='Inventory'),
	path('additem', views.AddItem.as_view(), name='AddItem'),
    path('Viewinventory', views.ViewInventory.as_view(), name='ViewInventory'),
    path('additemininventory', views.AddInventoryItem.as_view(), name='Inventoryadditem'),
    path('viewBorrowableCopies', views.ViewBorrowableItemCopies.as_view(), name='viewBorrowableCopies'),
]

