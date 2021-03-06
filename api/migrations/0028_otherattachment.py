# Generated by Django 3.2.5 on 2021-07-10 20:30

from django.db import migrations, models
import django.db.models.deletion
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0027_baseannex_revision_count'),
    ]

    operations = [
        migrations.CreateModel(
            name='OtherAttachment',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('attachment', models.FileField(upload_to='')),
                ('created', models.DateTimeField(default=django.utils.timezone.now)),
                ('contract', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='other_attachments', to='api.basecontract')),
            ],
        ),
    ]
