from django.urls import path
from . import views

urlpatterns = [
    path('inquiries/', views.InquiryView.as_view(), name='inquiry-list'),
    path('transactions/', views.TransactionView.as_view(), name='transaction-list'),
    path('transaction-items/', views.TransactionItemView.as_view(), name='transaction-item-list'),

  
]
