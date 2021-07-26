# Generated by Django 3.2.2 on 2021-07-25 07:37

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0030_alter_basecontract_status'),
    ]

    operations = [
        migrations.AlterField(
            model_name='customertemplateagreement',
            name='custom_contract_type',
            field=models.SmallIntegerField(choices=[(1, 'Trade'), (2, 'Service'), (3, 'Distribution'), (4, 'Agent'), (5, 'Rent'), (6, 'One Time'), (7, 'International')]),
        ),
    ]