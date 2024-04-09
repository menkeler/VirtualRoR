# utils.py
def cancel_reserved_items(inquiry_id):
    from .models import Inquiry  # Import within function to avoid circular import
    from django.shortcuts import get_object_or_404
    print("cancel Reserved Items Runned")
    # Retrieve the inquiry object using the inquiry_id
    inquiry = get_object_or_404(Inquiry, pk=inquiry_id)

    for reserved_item in inquiry.reserved_items.all():
        if hasattr(reserved_item, 'item') and reserved_item.item:
            reserved_item.item.is_reserved = False
            reserved_item.item.save()
        elif hasattr(reserved_item, 'inventory') and reserved_item.inventory:
            reserved_item.inventory.reserved_quantity -= reserved_item.quantity
            reserved_item.inventory.reserved_quantity = max(0, reserved_item.inventory.reserved_quantity)
            reserved_item.inventory.save()
