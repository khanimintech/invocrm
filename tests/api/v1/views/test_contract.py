from rest_framework.reverse import reverse

from api.models import CustomUser


def test_check(apiclient):

    response = apiclient.post(reverse('api:v1:check-django'))

    assert response.status_code == 200
    assert response.json()['message']


def test_contract_list(apiclient):

    response = apiclient.get(reverse('api:v1:contract-list'))

    assert response.status_code == 200
    print(response.json())
    assert False

    assert response.json()['message']


def test_login(apiclient, admin_user, PASSWORD):
    admin_user.is_active = True
    admin_user.save()
    print(CustomUser.objects.all(), 'mypytest')
    print(CustomUser.objects.all()[0].email, 'mypytest')
    response = apiclient.post(reverse('api:v1:login'), data={
        'email': admin_user.email,
        'password': PASSWORD
    })

    assert response.status_code == 200, response.json()
    print(response.json())
    assert response.json()['message']
