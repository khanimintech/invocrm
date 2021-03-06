# Generated by Django 3.2.2 on 2021-05-16 14:00

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0002_auto_20210516_1348'),
    ]

    operations = [
        migrations.AlterField(
            model_name='company',
            name='address',
            field=models.CharField(blank=True, max_length=512, null=True),
        ),
        migrations.AlterField(
            model_name='company',
            name='tin',
            field=models.CharField(blank=True, max_length=128, null=True, verbose_name='Taxpayer identification number'),
        ),
        migrations.AlterField(
            model_name='company',
            name='type',
            field=models.SmallIntegerField(blank=True, choices=[(1, 'MMC'), (2, 'ASC'), (3, 'QSC')], null=True),
        ),
    ]
