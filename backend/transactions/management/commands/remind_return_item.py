from django.core.management.base import BaseCommand
from django.utils import timezone
from datetime import timedelta
from ...models import Transaction
from django.template.loader import render_to_string
from django.core.mail import send_mail

class Command(BaseCommand):
    help = 'Sends email reminders for transactions with return dates approaching'

    def handle(self, *args, **kwargs):
        # Retrieve active transactions with return dates approaching
        approaching_return_transactions = self.get_approaching_return_transactions()

        # Check if there are any approaching return transactions
        if approaching_return_transactions.exists():
            # Send email reminders for approaching return transactions
            for transaction in approaching_return_transactions:
                self.send_return_reminder_email(transaction)

            self.stdout.write(self.style.SUCCESS('Email reminders sent for approaching return transactions.'))
        else:
            # If there are no approaching return transactions, do nothing
            self.stdout.write(self.style.SUCCESS('No approaching return transactions found.'))

    def get_approaching_return_transactions(self):
        # Retrieve transactions that are active and have a return date approaching
        approaching_return_transactions = Transaction.objects.filter(
            is_active=True,
            return_date__lte=timezone.now() + timedelta(days=1)  # Initialize to tomorrow to include today
        )

        # Iterate over approaching return transactions to adjust the return reminder date
        for transaction in approaching_return_transactions:
            # Calculate the borrowing duration
            borrowing_duration = transaction.return_date - transaction.date_created.date()

            # Adjust the reminder period based on the borrowing duration
            if borrowing_duration.days <= 3:
                # If borrowing duration is 3 days or less, set reminder to 1 day before return date
                transaction.reminder_date = transaction.return_date - timedelta(days=1)
            elif borrowing_duration.days <= 7:
                # If borrowing duration is 7 days or less, set reminder to 3 days before return date
                transaction.reminder_date = transaction.return_date - timedelta(days=3)
            else:
                # For longer borrowing durations, set reminder to 7 days before return date
                transaction.reminder_date = transaction.return_date - timedelta(days=7)

        return approaching_return_transactions

    def send_return_reminder_email(self, transaction):
        # Prepare email content
        subject = 'Return Reminder: Your borrowed item is due soon'
        recipient = transaction.participant.email
        
        # Render the HTML content using the template
        html_content = render_to_string('email/return_reminder.html', {'transaction': transaction})
        
        # Send the email using send_mail
        send_mail(subject, '', None, [recipient], html_message=html_content)
