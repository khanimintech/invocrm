# Generated by Django 3.2.2 on 2021-05-23 10:34

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0011_auto_20210523_1014'),
    ]

    operations = [
        migrations.AlterField(
            model_name='rentconditions',
            name='annex',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='rent_conditions', to='api.baseannex'),
        ),
    ]
