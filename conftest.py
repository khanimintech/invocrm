import pytest
from rest_framework.test import APIClient

from api.main_models.contract import Contact
from api.models import Person


@pytest.fixture
def PASSWORD():
    return 'password'


@pytest.fixture
def apiclient(db):
    return APIClient(format='json')


@pytest.fixture
def sales_manager(db):

    contact = Contact.objects.create(

    )

    sales_manager = Person.objects.create(
        type=Person.TYPE.SALES_MANAGER,
        first_name='First',
        last_name='Last',
        fathers_name='Father',
        contact=contact
    )

    return sales_manager
