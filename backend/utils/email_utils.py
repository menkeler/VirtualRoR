from django.core.mail import send_mail
from django.conf import settings 

def send_notification_email(subject, message, sender=None, recipient=None):
    sender = sender or settings.DEFAULT_FROM_EMAIL 
    send_mail(
        subject,
        message,
        sender,
        [recipient],
        fail_silently=False,
    )