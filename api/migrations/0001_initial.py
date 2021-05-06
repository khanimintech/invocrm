# Generated by Django 3.2 on 2021-05-06 20:01

import django.contrib.auth.models
import django.contrib.auth.validators
from django.db import migrations, models
import django.db.models.deletion
import django.utils.timezone


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('auth', '0012_alter_user_first_name_max_length'),
    ]

    operations = [
        migrations.CreateModel(
            name='AgentInvoiceItem',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('client_name', models.CharField(max_length=256)),
                ('invoice_no', models.CharField(max_length=256)),
                ('date', models.DateField(default=django.utils.timezone.now)),
                ('annex_no', models.IntegerField(default=django.utils.timezone.now)),
            ],
        ),
        migrations.CreateModel(
            name='Bank',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=256)),
                ('code', models.CharField(max_length=256)),
                ('tin', models.CharField(max_length=256, verbose_name='TIN')),
            ],
        ),
        migrations.CreateModel(
            name='BaseAnnex',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('request_no', models.CharField(max_length=256, unique=True)),
                ('annex_date', models.DateTimeField()),
                ('note', models.TextField()),
                ('payment_terms', models.TextField()),
                ('delivery_terms', models.TextField()),
                ('acquisition_terms', models.TextField()),
                ('created', models.DateTimeField(default=django.utils.timezone.now)),
            ],
        ),
        migrations.CreateModel(
            name='BaseContract',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('plant_name', models.CharField(default=None, max_length=256)),
                ('contract_no', models.CharField(blank=True, max_length=256, null=True)),
                ('type', models.SmallIntegerField(choices=[(1, 'Trade'), (2, 'Service'), (3, 'Distribution'), (4, 'Agent'), (5, 'Rent'), (6, 'One-time'), (7, 'Purchase order'), (8, 'International'), (9, 'Customer')])),
                ('created', models.DateTimeField(default=django.utils.timezone.now)),
                ('due_date', models.DateTimeField()),
                ('status', models.SmallIntegerField(choices=[(0, 'In process'), (1, 'Approved'), (2, 'Expired')], default=0)),
            ],
        ),
        migrations.CreateModel(
            name='Company',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('type', models.SmallIntegerField(choices=[(1, 'MMC'), (2, 'ASC'), (3, 'QSC')])),
                ('name', models.CharField(max_length=256, verbose_name='Company')),
                ('address', models.CharField(max_length=512)),
                ('tin', models.CharField(max_length=128, verbose_name='Taxpayer identification number')),
            ],
        ),
        migrations.CreateModel(
            name='Contact',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('mobile', models.CharField(blank=True, max_length=50, null=True)),
                ('address', models.CharField(blank=True, max_length=50, null=True)),
                ('work_email', models.CharField(blank=True, max_length=50, null=True)),
                ('personal_email', models.CharField(blank=True, max_length=50, null=True)),
            ],
        ),
        migrations.CreateModel(
            name='UnitOfMeasure',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=40)),
            ],
        ),
        migrations.CreateModel(
            name='AgentAgreement',
            fields=[
                ('basecontract_ptr', models.OneToOneField(auto_created=True, on_delete=django.db.models.deletion.CASCADE, parent_link=True, primary_key=True, serialize=False, to='api.basecontract')),
                ('territory', models.CharField(max_length=256, verbose_name='Applied territory')),
            ],
            bases=('api.basecontract',),
        ),
        migrations.CreateModel(
            name='CustomerTemplateAgreement',
            fields=[
                ('basecontract_ptr', models.OneToOneField(auto_created=True, on_delete=django.db.models.deletion.CASCADE, parent_link=True, primary_key=True, serialize=False, to='api.basecontract')),
                ('custom_contract_type', models.SmallIntegerField(choices=[(1, 'Trade'), (2, 'Service'), (3, 'Distribution'), (4, 'Agent')])),
            ],
            bases=('api.basecontract',),
        ),
        migrations.CreateModel(
            name='DistributionAgreement',
            fields=[
                ('basecontract_ptr', models.OneToOneField(auto_created=True, on_delete=django.db.models.deletion.CASCADE, parent_link=True, primary_key=True, serialize=False, to='api.basecontract')),
                ('territory', models.CharField(max_length=256, verbose_name='Applied territory')),
                ('subject_of_distribution', models.CharField(max_length=256, verbose_name='Subject of distribution')),
            ],
            bases=('api.basecontract',),
        ),
        migrations.CreateModel(
            name='InternationalAgreement',
            fields=[
                ('basecontract_ptr', models.OneToOneField(auto_created=True, on_delete=django.db.models.deletion.CASCADE, parent_link=True, primary_key=True, serialize=False, to='api.basecontract')),
                ('country', models.CharField(blank=True, max_length=256, null=True)),
                ('payment_condition', models.CharField(blank=True, max_length=256, null=True)),
            ],
            bases=('api.basecontract',),
        ),
        migrations.CreateModel(
            name='OneTimeAgreement',
            fields=[
                ('basecontract_ptr', models.OneToOneField(auto_created=True, on_delete=django.db.models.deletion.CASCADE, parent_link=True, primary_key=True, serialize=False, to='api.basecontract')),
                ('final_amount_with_writing', models.TextField()),
                ('price_offer', models.TextField()),
                ('price_offer_validity', models.TextField()),
                ('warranty_period', models.TextField()),
                ('unpaid_period', models.TextField()),
                ('unpaid_value', models.TextField()),
                ('part_payment', models.TextField()),
                ('part_acquisition', models.TextField()),
                ('standard', models.TextField()),
            ],
            bases=('api.basecontract',),
        ),
        migrations.CreateModel(
            name='POAgreement',
            fields=[
                ('basecontract_ptr', models.OneToOneField(auto_created=True, on_delete=django.db.models.deletion.CASCADE, parent_link=True, primary_key=True, serialize=False, to='api.basecontract')),
                ('po_number', models.CharField(max_length=256, verbose_name='Purchase order number')),
            ],
            bases=('api.basecontract',),
        ),
        migrations.CreateModel(
            name='RentAgreement',
            fields=[
                ('basecontract_ptr', models.OneToOneField(auto_created=True, on_delete=django.db.models.deletion.CASCADE, parent_link=True, primary_key=True, serialize=False, to='api.basecontract')),
            ],
            bases=('api.basecontract',),
        ),
        migrations.CreateModel(
            name='ServiceAgreement',
            fields=[
                ('basecontract_ptr', models.OneToOneField(auto_created=True, on_delete=django.db.models.deletion.CASCADE, parent_link=True, primary_key=True, serialize=False, to='api.basecontract')),
            ],
            bases=('api.basecontract',),
        ),
        migrations.CreateModel(
            name='TradeAgreement',
            fields=[
                ('basecontract_ptr', models.OneToOneField(auto_created=True, on_delete=django.db.models.deletion.CASCADE, parent_link=True, primary_key=True, serialize=False, to='api.basecontract')),
            ],
            bases=('api.basecontract',),
        ),
        migrations.CreateModel(
            name='TradeAgreementAnnex',
            fields=[
                ('baseannex_ptr', models.OneToOneField(auto_created=True, on_delete=django.db.models.deletion.CASCADE, parent_link=True, primary_key=True, serialize=False, to='api.baseannex')),
            ],
            bases=('api.baseannex',),
        ),
        migrations.CreateModel(
            name='ProductInvoiceItem',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=400)),
                ('quantity', models.IntegerField()),
                ('price', models.IntegerField()),
                ('total', models.IntegerField()),
                ('unit', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.unitofmeasure')),
            ],
        ),
        migrations.CreateModel(
            name='Person',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('first_name', models.CharField(max_length=256)),
                ('last_name', models.CharField(max_length=256)),
                ('fathers_name', models.CharField(max_length=256)),
                ('position', models.CharField(blank=True, max_length=50, null=True)),
                ('type', models.SmallIntegerField(choices=[(0, 'Buyer'), (1, 'Sales manager'), (2, 'Seller'), (3, 'Contact')])),
                ('contact', models.OneToOneField(null=True, on_delete=django.db.models.deletion.CASCADE, to='api.contact')),
            ],
        ),
        migrations.AddField(
            model_name='basecontract',
            name='company',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='api.company'),
        ),
        migrations.AddField(
            model_name='basecontract',
            name='responsible_person',
            field=models.OneToOneField(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='agreements', to='api.person'),
        ),
        migrations.AddField(
            model_name='basecontract',
            name='sales_manager',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='contracts', to='api.person'),
        ),
        migrations.AddField(
            model_name='baseannex',
            name='seller',
            field=models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to='api.person'),
        ),
        migrations.CreateModel(
            name='BankAccount',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('default', models.BooleanField(default=False, verbose_name='Is primary account?')),
                ('account', models.CharField(max_length=256)),
                ('swift_no', models.CharField(max_length=256)),
                ('correspondent_account', models.CharField(max_length=256)),
                ('bank', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.bank')),
                ('owner', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.company')),
            ],
        ),
        migrations.CreateModel(
            name='CustomUser',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('password', models.CharField(max_length=128, verbose_name='password')),
                ('last_login', models.DateTimeField(blank=True, null=True, verbose_name='last login')),
                ('is_superuser', models.BooleanField(default=False, help_text='Designates that this user has all permissions without explicitly assigning them.', verbose_name='superuser status')),
                ('username', models.CharField(error_messages={'unique': 'A user with that username already exists.'}, help_text='Required. 150 characters or fewer. Letters, digits and @/./+/-/_ only.', max_length=150, unique=True, validators=[django.contrib.auth.validators.UnicodeUsernameValidator()], verbose_name='username')),
                ('first_name', models.CharField(blank=True, max_length=150, verbose_name='first name')),
                ('last_name', models.CharField(blank=True, max_length=150, verbose_name='last name')),
                ('email', models.EmailField(blank=True, max_length=254, verbose_name='email address')),
                ('is_staff', models.BooleanField(default=False, help_text='Designates whether the user can log into this admin site.', verbose_name='staff status')),
                ('is_active', models.BooleanField(default=True, help_text='Designates whether this user should be treated as active. Unselect this instead of deleting accounts.', verbose_name='active')),
                ('date_joined', models.DateTimeField(default=django.utils.timezone.now, verbose_name='date joined')),
                ('plant_name', models.CharField(max_length=100)),
                ('groups', models.ManyToManyField(blank=True, help_text='The groups this user belongs to. A user will get all permissions granted to each of their groups.', related_name='user_set', related_query_name='user', to='auth.Group', verbose_name='groups')),
                ('user_permissions', models.ManyToManyField(blank=True, help_text='Specific permissions for this user.', related_name='user_set', related_query_name='user', to='auth.Permission', verbose_name='user permissions')),
            ],
            options={
                'verbose_name': 'user',
                'verbose_name_plural': 'users',
                'abstract': False,
            },
            managers=[
                ('objects', django.contrib.auth.models.UserManager()),
            ],
        ),
        migrations.CreateModel(
            name='POAgreementAnnex',
            fields=[
                ('basecontract_ptr', models.OneToOneField(auto_created=True, on_delete=django.db.models.deletion.CASCADE, parent_link=True, primary_key=True, serialize=False, to='api.basecontract')),
                ('supplement_no', models.CharField(max_length=64)),
                ('agreement', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.poagreement')),
            ],
            bases=('api.basecontract',),
        ),
    ]
