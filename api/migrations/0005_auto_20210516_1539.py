# Generated by Django 3.2.2 on 2021-05-16 15:39

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0004_alter_bank_tin'),
    ]

    operations = [
        migrations.AlterField(
            model_name='baseannex',
            name='acquisition_terms',
            field=models.TextField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='baseannex',
            name='annex_date',
            field=models.DateTimeField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='baseannex',
            name='delivery_terms',
            field=models.TextField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='baseannex',
            name='payment_terms',
            field=models.TextField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='baseannex',
            name='sales_manager',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='sales_manager_annex_list', to='api.person'),
        ),
        migrations.AlterField(
            model_name='baseannex',
            name='seller',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='seller_annex_list', to='api.person'),
        ),
    ]