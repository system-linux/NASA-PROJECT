# Generated by Django 3.2.22 on 2023-10-08 14:11

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('seismoscope', '0009_chatmess'),
    ]

    operations = [
        migrations.AlterField(
            model_name='chatmess',
            name='date',
            field=models.DateTimeField(auto_now_add=True),
        ),
    ]
