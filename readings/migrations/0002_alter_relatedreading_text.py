# Generated by Django 4.2.5 on 2023-10-06 12:49

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('readings', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='relatedreading',
            name='text',
            field=models.CharField(blank=True, null=True),
        ),
    ]
