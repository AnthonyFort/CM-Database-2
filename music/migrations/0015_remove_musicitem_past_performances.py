# Generated by Django 4.2.5 on 2023-10-06 10:11

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('music', '0014_alter_musicitem_keywords_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='musicitem',
            name='past_performances',
        ),
    ]
