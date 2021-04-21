import pytest
from rest_framework.test import APIClient


@pytest.fixture
def PASSWORD():
    return 'password'


@pytest.fixture
def apiclient(db):
    return APIClient(format='json')

