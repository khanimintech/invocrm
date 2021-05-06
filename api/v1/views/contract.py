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

            },
             {
                'id': 3,
                'contract_id': 345,
                'company_name': 'MC Donalds',
                'type': 'Ikidefelik müqavilə',
                'created': '2019-09-02',
                'end_date': '2020-09-02',
                'sales_name': 'Eli Eliyev',
                'status': 'Bitirmir',
                'executor': 'Saleh',
                'annex_count': 0,

            },
             {
                'id': 4,
                'contract_id': 4,
                'company_name': 'Zeruri MMC',
                'type': 'UcDefelik müqavilə',
                'created': '2019-09-02',
                'end_date': '2020-09-02',
                'sales_name': 'Yamac Kocavali',
                'status': 'Bitdi Bitecek',
                'executor': 'Cumali',
                'annex_count': 4,

            },
             {
                'id': 5,
                'contract_id': 5,
                'company_name': 'Labud MMC',
                'type': 'NDefelik müqavilə',
                'created': '2019-09-02',
                'end_date': '2020-09-02',
                'sales_name': 'Sultan anne',
                'status': 'Bitede biler bitmiyede biler',
                'executor': 'Idris babaaag',
                'annex_count': 19,

            },
             {
                'id': 6,
                'contract_id': 6,
                'company_name': 'Sesverme MMC',
                'type': 'Elustu müqavilə',
                'created': '2019-09-02',
                'end_date': '2020-09-02',
                'sales_name': 'Alico Veliyev',
                'status': 'Gelme Tuzak',
                'executor': 'Akin Kocovali',
                'annex_count': 3,

            },
             {
                'id': 7,
                'contract_id': 7,
                'company_name': 'CukurSport MMC',
                'type': 'cukur evimiz',
                'created': '2019-09-02',
                'end_date': '2020-09-02',
                'sales_name': 'Vartolu',
                'status': 'Manqal',
                'executor': 'Azer Kurtulush',
                'annex_count': 24345,

            },
             {
                'id': 8,
                'contract_id': 2,
                'company_name': 'Cayxana MMC',
                'type': 'spoiler',
                'created': '2019-09-02',
                'end_date': '2020-09-02',
                'sales_name': 'Baykal',
                'status': 'Yavshak',
                'executor': 'Meke',
                'annex_count': 2,

            },
             {
                'id': 9,
                'contract_id': 9,
                'company_name': 'Vacib MMC',
                'type': 'Birdəfəlik müqavilə',
                'created': '2019-09-02',
                'end_date': '2020-09-02',
                'sales_name': 'Veli Veliyev',
                'status': 'Bitir',
                'executor': 'Ferid ',
                'annex_count': 4,

            },
        ]})
