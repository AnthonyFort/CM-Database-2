# Generated by Django 4.2.5 on 2023-10-09 11:04

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('readings', '0002_alter_relatedreading_text'),
    ]

    operations = [
        migrations.AlterUniqueTogether(
            name='relatedreading',
            unique_together={('book', 'chapter', 'start_verse', 'end_verse')},
        ),
    ]
