# Generated by Django 4.2.5 on 2023-10-09 10:35

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('services', '0006_remove_service_music_items_service_music_items'),
    ]

    operations = [
        migrations.AlterField(
            model_name='service',
            name='date_of_service',
            field=models.DateField(default=datetime.date.today, unique=True),
        ),
    ]