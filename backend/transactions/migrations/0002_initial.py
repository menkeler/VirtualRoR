# Generated by Django 4.2.7 on 2024-02-15 15:05

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('transactions', '0001_initial'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('inventory', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='transaction',
            name='participant',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='transactions', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='reserveditem',
            name='inquiry',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='reserved_items', to='transactions.inquiry'),
        ),
        migrations.AddField(
            model_name='reserveditem',
            name='inventory',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='reserved_items', to='inventory.inventory'),
        ),
        migrations.AddField(
            model_name='reserveditem',
            name='item',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='reserved_items_itemcopy', to='inventory.itemcopy'),
        ),
        migrations.AddField(
            model_name='inquiry',
            name='inquirer',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='inquiries', to=settings.AUTH_USER_MODEL),
        ),
    ]
