# Generated by Django 4.2.7 on 2023-12-03 10:22

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('inventory', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='ItemCopy',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('condition', models.CharField(default='Good', max_length=50)),
                ('is_borrowed', models.BooleanField(default=False)),
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
            ],
        ),
        migrations.RemoveField(
            model_name='item',
            name='category',
        ),
        migrations.AddField(
            model_name='inventory',
            name='borrowed_quantity',
            field=models.PositiveIntegerField(default=0),
        ),
        migrations.AlterField(
            model_name='category',
            name='name',
            field=models.CharField(max_length=150),
        ),
        migrations.DeleteModel(
            name='BorrowableItemCopy',
        ),
        migrations.AddField(
            model_name='itemprofiling',
            name='category',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='inventory.category'),
        ),
        migrations.AddField(
            model_name='itemcopy',
            name='inventory',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='item_copies', to='inventory.inventory'),
        ),
        migrations.AlterField(
            model_name='inventory',
            name='item',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='inventory.itemprofiling'),
        ),
        migrations.DeleteModel(
            name='Item',
        ),
    ]
