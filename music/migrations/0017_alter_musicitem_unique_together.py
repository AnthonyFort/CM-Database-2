# Generated by Django 4.2.5 on 2023-10-06 11:42

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('music', '0016_alter_musicitem_unique_together'),
    ]

    operations = [
        migrations.AlterUniqueTogether(
            name='musicitem',
            unique_together=set(),
        ),
    ]
