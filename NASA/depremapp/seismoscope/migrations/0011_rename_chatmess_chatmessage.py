# Generated by Django 3.2.22 on 2023-10-08 17:01

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('seismoscope', '0010_alter_chatmess_date'),
    ]

    operations = [
        migrations.RenameModel(
            old_name='chatmess',
            new_name='chatmessage',
        ),
    ]