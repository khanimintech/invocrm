from rest_framework.reverse import reverse
from django.utils import timezone

from api.main_models.annex import BaseAnnex, ProductInvoiceItem, UnitOfMeasure
from api.main_models.contract import TradeAgreement, BaseContract


class TestAnnexViewSet:

    def test_annex_list_ok(self, apiclient, admin_user, sales_manager):

        contract = TradeAgreement.objects.create(plant_name='plant', sales_manager=sales_manager,
                                                 due_date=timezone.now(),type=BaseContract.Type.TRADE)

        annex = BaseAnnex.objects.create(contract=contract, request_no='1223', annex_date=timezone.now(),
                                 note='122', payment_terms='122', delivery_terms='111', acquisition_terms='133',
                                 seller=sales_manager, sales_manager=sales_manager, annex_no=1)

        annex2 = BaseAnnex.objects.create(contract=contract, request_no='123', annex_date=timezone.now(),
                                         note='1', payment_terms='1', delivery_terms='1', acquisition_terms='1',
                                         seller=sales_manager, sales_manager=sales_manager, annex_no=2)

        unit = UnitOfMeasure.objects.create(name='w')
        ProductInvoiceItem.objects.create(name='ww', annex=annex, unit=unit, quantity=1, price=1, total=2)

        admin_user.plant_name = 'plant'
        admin_user.save()
        apiclient.force_login(admin_user)
        response = apiclient.get(reverse('api:v1:annex-list'))

        assert response.status_code == 200
        payload = response.json()

        assert payload[0]['id'] == annex.id
        assert payload[0]['company_name'] == 'N/A'
        assert payload[0]['request_no'] == '1223'
        assert payload[0]['contract_no'] is None
        assert payload[0]['annex_no'] == 1
        assert payload[0]['sales_manager'] == sales_manager.id
        assert payload[0]['payment_terms'] == '122'

        assert payload[1]['id'] == annex2.id
        assert payload[1]['company_name'] == 'N/A'
        assert payload[1]['request_no'] == '123'
        assert payload[1]['contract_no'] is None
        assert payload[1]['annex_no'] == 2
        assert payload[1]['sales_manager'] == sales_manager.id
        assert payload[1]['payment_terms'] == '1'
