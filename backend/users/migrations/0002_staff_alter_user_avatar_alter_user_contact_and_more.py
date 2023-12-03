# Generated by Django 4.2.7 on 2023-12-03 10:22

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Staff',
            fields=[
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, primary_key=True, serialize=False, to=settings.AUTH_USER_MODEL)),
                ('position', models.CharField(choices=[('Program Officer', 'Program Officer'), ('Director', 'Director')], max_length=255)),
                ('date_hired', models.DateTimeField(default=django.utils.timezone.now)),
            ],
            options={
                'verbose_name_plural': 'Staff Members',
            },
        ),
        migrations.AlterField(
            model_name='user',
            name='avatar',
            field=models.ImageField(default='public/default.png', upload_to='avatars/'),
        ),
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
