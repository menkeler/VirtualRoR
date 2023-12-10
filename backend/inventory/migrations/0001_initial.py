# Generated by Django 4.2.7 on 2023-12-10 08:35

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Category',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=150)),
            ],
        ),
        migrations.CreateModel(
            name='Inventory',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('quantity', models.PositiveIntegerField(default=0)),
            ],
        ),
        migrations.CreateModel(
            name='ItemProfiling',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=150, unique=True)),
                ('returnable', models.BooleanField(default=False)),
                ('description', models.TextField()),
                ('image', models.ImageField(default='default.png', upload_to='items/')),
                ('category', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='inventory.category')),
            ],
        ),
        migrations.CreateModel(
            name='ItemCopy',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('condition', models.CharField(choices=[('Acceptable', 'Acceptable'), ('Good', 'Good'), ('Like new', 'Like new'), ('Damaged', 'Damaged'), ('Lost', 'Lost')], default='Good', max_length=50)),
                ('is_borrowed', models.BooleanField(default=False)),
                ('inventory', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='item_copies', to='inventory.inventory')),
            ],
        ),
        migrations.AddField(
            model_name='inventory',
            name='item',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='inventory.itemprofiling'),
        ),
    ]
