# Generated by Django 3.2.2 on 2021-05-16 14:33

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0003_auto_20210516_1400'),
    ]

    operations = [
        migrations.AlterField(
            model_name='bank',
            name='tin',
            field=models.CharField(max_length=256, null=True, verbose_name='TIN'),
        ),
    ]