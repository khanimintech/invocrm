# Generated by Django 3.2.2 on 2021-07-07 13:57

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0026_contact_company_name'),
    ]

    operations = [
        migrations.AddField(
            model_name='baseannex',
            name='revision_count',
            field=models.IntegerField(default=0),
        ),
    ]
