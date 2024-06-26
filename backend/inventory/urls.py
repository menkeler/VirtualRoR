from django.urls import path,include
from . import views
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register('categories', views.CategoryViewSet, basename='category')
router.register('item-profiling', views.ItemProfilingViewSet, basename='item-profiling')
router.register('item-copies', views.ItemCopyViewSet, basename='item-copy')
router.register('edit-item-copy-status', views.EditItemCopyStatusViewSet, basename='edit-item-copy-status')
router.register('inventories',views.InventoryViewSet, basename='inventory')
router.register('export-history', views.ExportHistoryViewSet, basename='export-history') 

urlpatterns = [
    path('', include(router.urls)),
    path('export', views.ExportMultipleTablesView.as_view(), name='export_multiple_tables'),
    path('itemscopylog/<int:item_copy_id>/', views.ItemCopyTransactionsView.as_view(), name='itemscopylog'),

]