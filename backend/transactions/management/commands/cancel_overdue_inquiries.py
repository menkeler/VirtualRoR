# management/commands/cancel_overdue_inquiries.py

from django.core.management.base import BaseCommand
from django.utils import timezone
from datetime import timedelta
from ...models import Inquiry
from ...utils import cancel_reserved_items

class Command(BaseCommand):
    help = 'Cancels overdue inquiries and removes reservations'

    def handle(self, *args, **kwargs):
        # Calculate the date three days ago
        two_days_ago = timezone.now() - timedelta(seconds=10)
        
        # Retrieve inquiries that are still pending and were created more than ten seconds ago
        overdue_inquiries = Inquiry.objects.filter(status='Accepted', date_created__lte=two_days_ago)
        
        # Cancel overdue inquiries
        for inquiry in overdue_inquiries:
            inquiry.status = 'Cancelled'
            inquiry.save()
            
            # Call cancel_reserved_items for each inquiry
            cancel_reserved_items(inquiry.id)
