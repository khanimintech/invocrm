# Generated by Django 3.2.2 on 2021-06-09 19:44

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0019_baseannex_total'),
    ]

    operations = [
        migrations.AddField(
            model_name='contact',
            name='plant_name',
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
    ]