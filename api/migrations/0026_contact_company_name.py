# Generated by Django 3.2.2 on 2021-07-07 13:14

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0025_alter_baseannex_status'),
    ]

    operations = [
        migrations.AddField(
            model_name='contact',
            name='company_name',
            field=models.CharField(blank=True, max_length=256, null=True),
        ),
    ]
