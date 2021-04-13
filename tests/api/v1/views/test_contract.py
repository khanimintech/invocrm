from rest_framework.reverse import reverse


def test_check(apiclient):

    response = apiclient.post(reverse('api:v1:check-django'))

    assert response.status_code == 200
    assert response.json()['message']
