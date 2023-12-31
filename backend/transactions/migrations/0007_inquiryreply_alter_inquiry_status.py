# Generated by Django 4.2.7 on 2023-12-18 10:00

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('transactions', '0006_rename_item_copy_reserveditem_item_and_more'),
    ]

    operations = [
        migrations.CreateModel(
            name='InquiryReply',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('message', models.TextField()),
            ],
        ),
        migrations.AlterField(
            model_name='inquiry',
            name='status',
            field=models.CharField(choices=[('Pending', 'Pending'), ('Accepted', 'Accepted'), ('Rejected', 'Rejected'), ('Cancelled', 'Cancelled'), ('Processed', 'Processed')], default='Pending', max_length=20),
        ),
    ]
