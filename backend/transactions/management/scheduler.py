# scheduler.py

from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.triggers.interval import IntervalTrigger
from django.core.management import call_command

def cancel_overdue_inquiries_job():
    print("Executing cancel_overdue_inquiries_job...")
    call_command('cancel_overdue_inquiries')
    print("cancel_overdue_inquiries_job executed successfully.")

scheduler = BackgroundScheduler()
scheduler.add_job(cancel_overdue_inquiries_job, IntervalTrigger(seconds=10))  # Schedule job to run every 10 seconds
