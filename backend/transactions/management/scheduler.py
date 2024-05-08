# scheduler.py

from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.triggers.interval import IntervalTrigger
from django.core.management import call_command
from apscheduler.triggers.cron import CronTrigger

def cancel_overdue_inquiries_job():
    print("Executing cancel_overdue_inquiries_job...")
    call_command('cancel_overdue_inquiries')
    print("cancel_overdue_inquiries_job executed successfully.")
    

def remind_Transaction_date_job():
    print("Executing remind_Transaction_date_job...")
    call_command('remind_return_item')
    print("remind_Transaction_date_job executed successfully.")

def backup_database_job():
    print("Executing backup_database_job...")
    call_command('backup_database')
    print("backup_database_job executed successfully.")

scheduler = BackgroundScheduler()

#check overdue every 10 mins
scheduler.add_job(cancel_overdue_inquiries_job, IntervalTrigger(minutes=5))

#remind Email eveyy 9 pam at night
scheduler.add_job(remind_Transaction_date_job, CronTrigger(hour=21))

#backupdatabse
scheduler.add_job(backup_database_job, CronTrigger(hour=0))