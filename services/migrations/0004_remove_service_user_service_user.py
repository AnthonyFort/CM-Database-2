# Generated by Django 4.2.5 on 2023-10-05 15:38

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('services', '0003_service_user'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='service',
            name='user',
        ),
        migrations.AddField(
            model_name='service',
            name='user',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='past_services', to=settings.AUTH_USER_MODEL),
        ),
    ]
