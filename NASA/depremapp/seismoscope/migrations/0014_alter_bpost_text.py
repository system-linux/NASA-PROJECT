# Generated by Django 3.2.22 on 2023-10-08 19:10

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('seismoscope', '0013_bpost_date'),
    ]

    operations = [
        migrations.AlterField(
            model_name='bpost',
            name='text',
            field=models.CharField(max_length=3000),
        ),
    ]