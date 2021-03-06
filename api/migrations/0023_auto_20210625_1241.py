# Generated by Django 3.2.2 on 2021-06-25 12:41

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0022_auto_20210618_1223'),
    ]

    operations = [
        migrations.AddField(
            model_name='baseannex',
            name='status',
            field=models.SmallIntegerField(choices=[(0, 'In process'), (1, 'Approved'), (2, 'Expired')], default=0),
        ),
        migrations.AlterField(
            model_name='baseannex',
            name='annex_no',
            field=models.IntegerField(default=0),
        ),
    ]
