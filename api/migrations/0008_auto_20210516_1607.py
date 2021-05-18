# Generated by Django 3.2.2 on 2021-05-16 16:07

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0007_auto_20210516_1604'),
    ]

    operations = [
        migrations.AlterField(
            model_name='basecontract',
            name='due_date',
            field=models.DateTimeField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='basecontract',
            name='status',
            field=models.SmallIntegerField(choices=[(0, 'In process'), (1, 'Approved'), (2, 'Expired')], default=0),
        ),
    ]