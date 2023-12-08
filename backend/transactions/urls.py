from django.urls import path
from . import views
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'inquiries', views.InquiryViewSet, basename='inquiry')
router.register(r'transactions', views.TransactionViewSet, basename='transaction')
router.register(r'inquiries_item', views.ReservedItemViewSet, basename='single_transaction')
router.register(r'transaction_items', views.TransactionItemViewSet, basename='transaction_item')

urlpatterns = router.urls