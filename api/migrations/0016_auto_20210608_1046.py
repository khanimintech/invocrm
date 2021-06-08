# Generated by Django 3.2.3 on 2021-06-08 10:46

from django.db import migrations, models
import django.db.models.deletion
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0015_contractattachment'),
    ]

    operations = [
        migrations.AddField(
            model_name='contractattachment',
            name='created',
            field=models.DateTimeField(default=django.utils.timezone.now),
        ),
        migrations.AlterField(
            model_name='contractattachment',
            name='contract',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='attachments', to='api.basecontract'),
        ),
        migrations.CreateModel(
            name='AnnexAttachment',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('attachment', models.FileField(upload_to='')),
                ('created', models.DateTimeField(default=django.utils.timezone.now)),
                ('contract', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='annex_attachments', to='api.basecontract')),
            ],
        ),
    ]