# Generated by Django 4.2.7 on 2023-12-18 10:14

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('transactions', '0007_inquiryreply_alter_inquiry_status'),
    ]

    operations = [
        migrations.AddField(
            model_name='transaction',
            name='inquiry',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='transactions.inquiry'),
        ),
    ]