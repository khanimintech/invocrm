# Generated by Django 3.2.2 on 2021-06-14 08:42

from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0020_contact_plant_name'),
    ]

    operations = [
        migrations.AlterField(
            model_name='baseannex',
            name='annex_date',
            field=models.DateTimeField(blank=True, default=django.utils.timezone.now, null=True),
        ),
    ]
