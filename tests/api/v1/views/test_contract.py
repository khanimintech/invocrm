from rest_framework.reverse import reverse

from api.models import CustomUser


def test_check(apiclient):

    response = apiclient.post(reverse('api:v1:check-django'))

    assert response.status_code == 200
    assert response.json()['message']


def test_contract_list(apiclient):

    response = apiclient.get(reverse('api:v1:contracts-list'))

    assert response.status_code == 200
    assert response.json()['message']


def test_login(apiclient, admin_user, PASSWORD):

    admin_user.is_active = True
    admin_user.save()
    response = apiclient.post(reverse('api:v1:login'), data={
        'email': admin_user.email,
        'password': PASSWORD
    })

    assert response.status_code == 200, response.json()
