from django.http import JsonResponse
from rest_framework.views import APIView


def check_view(request):

    return JsonResponse({
        'message': 'OK'
    })


class StubAPI(APIView):

    def get(self, request):

        return JsonResponse({'data': [
            {
                'id': 1,
                'contract_id': 1,
                'company_name': 'Vacib MMC',
                'type': 'Birdəfəlik müqavilə',
                'created': '2018-09-02',
                'end_date': '2019-09-02',
                'sales_name': 'Asif Veliyev',
                'status': 'In process',
                'executor': 'Sabina ',
                'annex_count': 2,

            },
            {
                'id': 2,
                'contract_id': 2,
                'company_name': 'Vacib MMC',
                'type': 'Birdəfəlik müqavilə',
                'created': '2019-09-02',
                'end_date': '2020-09-02',
                'sales_name': 'Veli Veliyev',
                'status': 'Bitir',
                'executor': 'Ferid ',
                'annex_count': 4,

            }
        ]})
