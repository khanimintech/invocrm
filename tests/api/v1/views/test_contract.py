from rest_framework.reverse import reverse


def test_check(apiclient):

    response = apiclient.post(reverse('api:v1:check-django'))

    assert response.status_code == 200
    assert response.json()['message']


def test_contract_list(apiclient):

    response = apiclient.get('api/contracts')

    assert response.status_code == 200
    print(response.json())
    assert False

    assert response.json()['message']
