# Generated by Django 4.2.7 on 2023-12-01 06:42

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0002_alter_user_contact'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='contact',
            field=models.CharField(blank=True, default='', max_length=15),
        ),
        migrations.AlterField(
            model_name='user',
            name='department',
            field=models.CharField(blank=True, default='', max_length=255),
        ),
    ]