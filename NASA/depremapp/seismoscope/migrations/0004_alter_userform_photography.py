# Generated by Django 3.2.22 on 2023-10-08 11:39

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('seismoscope', '0003_userform'),
    ]

    operations = [
        migrations.AlterField(
            model_name='userform',
            name='photography',
            field=models.ImageField(upload_to='uploads'),
        ),
    ]
