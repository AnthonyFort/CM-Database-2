# Generated by Django 4.2.5 on 2023-10-05 10:37

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('music', '0005_rename_added_by_musicitem_user_and_more'),
    ]

    operations = [
        migrations.RenameField(
            model_name='musicitem',
            old_name='user',
            new_name='user_id',
        ),
    ]