# Generated by Django 4.2.7 on 2024-04-03 13:26

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='enable_notifications',
            field=models.BooleanField(default=True),
        ),
    ]
