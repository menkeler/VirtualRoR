# Generated by Django 4.2.7 on 2024-04-10 14:32

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Post',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('category', models.CharField(choices=[('Regular', 'Regular'), ('Announcements', 'Announcements')], max_length=30)),
                ('message', models.TextField()),
                ('title', models.CharField(max_length=255)),
                ('images', models.ImageField(blank=True, null=True, upload_to='post_images/')),
                ('views', models.PositiveIntegerField(default=0)),
                ('status', models.CharField(choices=[('Pending', 'Pending'), ('Accepted', 'Accepted'), ('Rejected', 'Rejected'), ('Completed', 'Completed')], default='Pending', max_length=20)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
            ],
        ),
    ]
