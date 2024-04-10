import os
from django.core.management.base import BaseCommand
from django.conf import settings
import subprocess
from datetime import datetime

class Command(BaseCommand):
    help = 'Backup PostgreSQL database'

    def handle(self, *args, **kwargs):
        # Define backup directory
        backup_dir = os.path.join(settings.BASE_DIR, 'backups')
        os.makedirs(backup_dir, exist_ok=True)

        # Define backup file name with timestamp
        backup_file = os.path.join(backup_dir, f'db_backup_{datetime.now().strftime("%Y-%m-%d_%H-%M-%S")}.sql')
        
        pg_dump_path = r'C:\Program Files\PostgreSQL\16\bin\pg_dump.exe'
        
        # Set the PGPASSWORD environment variable
        os.environ['PGPASSWORD'] = settings.DATABASES['default']['PASSWORD']

        # Construct pg_dump command
        pg_dump_cmd = [
             pg_dump_path,
            '-U', settings.DATABASES['default']['USER'],
            '-h', settings.DATABASES['default']['HOST'],
            '-p', str(settings.DATABASES['default']['PORT']),
            '-f', backup_file,
            '-d', settings.DATABASES['default']['NAME'],
        ]

        # Execute pg_dump command
        try:
            subprocess.Popen(pg_dump_cmd, stderr=subprocess.PIPE, stdout=subprocess.PIPE)
            self.stdout.write(self.style.SUCCESS('Database backup created successfully.'))
        except subprocess.CalledProcessError as e:
            self.stdout.write(self.style.ERROR(f"Error executing pg_dump command: {e}"))
