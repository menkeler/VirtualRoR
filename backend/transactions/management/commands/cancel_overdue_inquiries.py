from django.core.management.base import BaseCommand
from django.utils import timezone
from datetime import timedelta
from ...models import Inquiry
from ...utils import cancel_reserved_items

class Command(BaseCommand):
    help = 'Cancels overdue inquiries and removes reservations'

    def handle(self, *args, **kwargs):
        # Calculate the date three days ago
        three_days_ago = timezone.now() - timedelta(days=3)
        
        # Retrieve inquiries that are still pending and were created more than ten seconds ago
        overdue_reservation_inquiries = Inquiry.objects.filter(
            inquiry_type='Reservation',
            status='Accepted',
            status_updated_at__lte=three_days_ago
        )

        
        # Check if there are any overdue reservation inquiries
        if overdue_reservation_inquiries.exists():
            # Cancel overdue inquiries
            for inquiry in overdue_reservation_inquiries:
                inquiry.status = 'Cancelled'
                inquiry.save()
                
                # Call cancel_reserved_items for each inquiry
                cancel_reserved_items(inquiry.id)
        else:
            # If there are no overdue reservation inquiries, do nothing
            self.stdout.write(self.style.SUCCESS('No overdue reservation inquiries found.'))
