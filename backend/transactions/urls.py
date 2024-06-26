from django.urls import path
from . import views
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register('inquiries', views.InquiryViewSet, basename='inquiry')
router.register('transactions', views.TransactionViewSet, basename='transaction')
router.register('inquiries_item', views.ReservedItemViewSet, basename='single_transaction')
router.register('transaction_items', views.TransactionItemViewSet, basename='transaction_item')

urlpatterns = router.urls + [
    path('confirm_reservation/<int:inquiry_id>/<str:purpose>/', views.confirm_reservation, name='confirm_reservation'),
    path('process_transaction/<str:transaction_type>/', views.process_transaction, name='process_transaction_with_type'),
    path('cancel_reserved_items/<int:inquiry_id>/', views.cancel_reserved_items, name='cancel_reserved_items'),


]