# Generated by Django 4.2.7 on 2024-04-10 14:32

from django.db import migrations, models
import django.db.models.deletion
import django.utils.timezone


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('inventory', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Inquiry',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('message', models.TextField()),
                ('inquiry_type', models.CharField(choices=[('Reservation', 'Reservation'), ('Donation', 'Donation')], max_length=20)),
                ('status', models.CharField(choices=[('Pending', 'Pending'), ('Accepted', 'Accepted'), ('Rejected', 'Rejected'), ('Cancelled', 'Cancelled'), ('Processed', 'Processed')], default='Pending', max_length=20)),
                ('date_preferred', models.DateField()),
                ('date_created', models.DateTimeField(auto_now_add=True)),
                ('status_updated_at', models.DateTimeField(default=django.utils.timezone.now)),
            ],
        ),
        migrations.CreateModel(
            name='InquiryReply',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('message', models.TextField()),
            ],
        ),
        migrations.CreateModel(
            name='ReservedItem',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('quantity', models.PositiveIntegerField()),
            ],
        ),
        migrations.CreateModel(
            name='Transaction',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('date_created', models.DateTimeField(auto_now_add=True)),
                ('transaction_type', models.CharField(choices=[('Release', 'Release'), ('Donation', 'Donation')], max_length=20)),
                ('remarks', models.TextField(blank=True, null=True)),
                ('is_active', models.BooleanField(default=True)),
                ('return_date', models.DateField(blank=True, null=True)),
                ('inquiry', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='transactions.inquiry')),
            ],
        ),
        migrations.CreateModel(
            name='TransactionItem',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('quantity', models.PositiveIntegerField()),
                ('return_date', models.DateField(blank=True, null=True)),
                ('status', models.CharField(blank=True, choices=[('Active', 'Active'), ('Returned', 'Returned'), ('Lost', 'Lost'), ('Consumable', 'Consumable')], max_length=10, null=True)),
                ('condition', models.CharField(blank=True, choices=[('Acceptable', 'Acceptable'), ('Good', 'Good'), ('Like new', 'Like new'), ('Damaged', 'Damaged'), ('Lost', 'Lost')], max_length=50, null=True)),
                ('inventory', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='transaction_items_inventory', to='inventory.inventory')),
                ('item', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='transaction_items_itemcopy', to='inventory.itemcopy')),
                ('transaction', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='transaction_items', to='transactions.transaction')),
            ],
        ),
    ]
