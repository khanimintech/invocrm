# Generated by Django 3.2.2 on 2021-07-13 11:41

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0028_otherattachment'),
    ]

    operations = [
        migrations.AddField(
            model_name='contact',
            name='custom',
            field=models.BooleanField(default=False),
        ),
    ]