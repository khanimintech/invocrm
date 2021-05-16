# Generated by Django 3.2.2 on 2021-05-16 16:04

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0006_alter_baseannex_annex_no'),
    ]

    operations = [
        migrations.AlterField(
            model_name='baseannex',
            name='note',
            field=models.TextField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='basecontract',
            name='status',
            field=models.SmallIntegerField(blank=True, choices=[(0, 'In process'), (1, 'Approved'), (2, 'Expired')], default=0, null=True),
        ),
    ]
