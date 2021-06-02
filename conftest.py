import pytest
from rest_framework.test import APIClient


from api.main_models.contract import Contact, Company
from api.models import Person


@pytest.fixture
def PASSWORD():
    return 'password'


@pytest.fixture
def apiclient(db):
    return APIClient(format='json')


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
    contact = Contact.objects.create(mobile='12345_rp', address='rp_address',
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
