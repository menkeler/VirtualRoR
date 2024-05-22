from django.core.management.base import BaseCommand
from django.utils import timezone
from ...models import Inquiry

class Command(BaseCommand):
    help = 'Cancels overdue inquiries and rejects pending donation inquiries with past date_preferred'

    def handle(self, *args, **kwargs):
        # Calculate the current time
        current_time = timezone.now()

        # Reject pending donation inquiries with past date_preferred
        pending_donation_inquiries = Inquiry.objects.filter(
            inquiry_type='Donation',
            status='Pending',
            date_preferred__lt=current_time
        )

        # Update status of pending donation inquiries to 'Rejected'
        for inquiry in pending_donation_inquiries:
            inquiry.status = 'Rejected'
            inquiry.save()

        self.stdout.write(self.style.SUCCESS('Pending donation inquiries with past date_preferred have been rejected.'))
