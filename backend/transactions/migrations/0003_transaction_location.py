# Generated by Django 4.2.7 on 2024-05-14 03:54

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('transactions', '0002_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='transaction',
            name='location',
            field=models.TextField(blank=True, null=True),
        ),
    ]