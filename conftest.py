import pytest
from django.utils import timezone
from rest_framework.test import APIClient


from api.main_models.contract import Contact, Company, TradeAgreement, BaseContract, Bank, BankAccount
from api.models import Person


@pytest.fixture
def PASSWORD():
    return 'password'


@pytest.fixture
def apiclient(db):
    return APIClient(format='json')


@pytest.fixture()
def admin_user(admin_user):
    admin_user.plant_name = 'plant'
    admin_user.save()
    return admin_user


@pytest.fixture
def sales_manager(db):
    contact = Contact.objects.create(mobile='12345_sales_m', address='sales_m_address',
                                     personal_email='sales_m@email.email', web_site='sales_m.site')

    sales_manager = Person.objects.create(
        type=Person.TYPE.SALES_MANAGER,
        first_name='First',
        last_name='Last',
        fathers_name='Father',
        contact=contact
    )

    return sales_manager


@pytest.fixture
def responsible_person(db):
    contact = Contact.objects.create(mobile='12345_rp', address='rp_address', work_email='rp_wemail@email.email',
                                     personal_email='rp_email@email.email', web_site='rp_site.site')

    responsible_person = Person.objects.create(
        type=Person.TYPE.CONTACT,
        first_name='Resp',
        last_name='Pers',
        fathers_name='Resp_Father',
        contact=contact
    )

    return responsible_person


@pytest.fixture
def executor(db):
    contact = Contact.objects.create(mobile='12345_exe', address='exe_address',
                                     personal_email='exe_email@email.email', web_site='exe_site.site')

    executor = Person.objects.create(
        type=Person.TYPE.BUYER,
        first_name='Exe',
        last_name='Cutor',
        fathers_name='Exe_Father',
        contact=contact
    )

    return executor


@pytest.fixture
def company(db):
    return Company.objects.create(type=Company.MMC, name='company_name', address='company_address', tin='12345')


@pytest.fixture
def trade_aggrement_base(db, company, sales_manager, responsible_person, executor):
    t = TradeAgreement.objects.create(plant_name='plant', sales_manager=sales_manager, due_date=timezone.now(),
                                      type=BaseContract.Type.SERVICE, contract_no='1234', company=company,
                                      executor=executor, responsible_person=responsible_person)

    bank = Bank.objects.create(name='bank_name', code='123', tin='1234')

    BankAccount.objects.create(account='123', bank=bank, address='address', city='city1',
                               swift_no='swift_123', correspondent_account='cor_123', company_owner=company)
    return t.basecontract_ptr

