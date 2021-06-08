from rest_framework.reverse import reverse
from django.utils import timezone

from api.main_models.annex import BaseAnnex, ProductInvoiceItem, UnitOfMeasure
from api.main_models.contract import TradeAgreement, BaseContract, AgentAgreement, RentAgreement


class TestAnnexViewSet:

    def test_annex_list_ok(self, apiclient, admin_user, sales_manager):

        contract = TradeAgreement.objects.create(plant_name='plant', sales_manager=sales_manager,
                                                 due_date=timezone.now(),type=BaseContract.Type.TRADE)

        annex = BaseAnnex.objects.create(contract=contract, request_no='1223', annex_date=timezone.now(),
                                 note='122', payment_terms='122', delivery_terms='111', acquisition_terms='133',
                                 seller=sales_manager, sales_manager=sales_manager, annex_no=1)

        annex2 = BaseAnnex.objects.create(contract=contract, request_no='123', annex_date=timezone.now(),
                                          note='1', payment_terms='1', delivery_terms='1', acquisition_terms='1',
                                          seller=sales_manager, sales_manager=sales_manager, annex_no=2, with_vat=True)

        unit = UnitOfMeasure.objects.create(name='w')

        ProductInvoiceItem.objects.create(name='ww', annex=annex, unit=unit, quantity=1, price=1, total=2)
        ProductInvoiceItem.objects.create(name='ww', annex=annex, unit=unit, quantity=1, price=1, total=2)
        ProductInvoiceItem.objects.create(name='ww', annex=annex2, unit=unit, quantity=1, price=1, total=2)


        apiclient.force_login(admin_user)
        response = apiclient.get(reverse('api:v1:annexes-list'))

        assert response.status_code == 200
        payload = response.json()

        assert payload[0]['id'] == annex.id
        assert payload[0]['company_name'] == 'N/A'
        assert payload[0]['request_no'] == '1223'
        assert payload[0]['contract_no'] is None
        assert payload[0]['annex_no'] == 1
        assert payload[0]['sales_manager'] == sales_manager.id
        assert payload[0]['payment_terms'] == '122'
        assert payload[0]['contract_type'] == annex.contract.type
        assert payload[0]['sum_no_invoice'] == 4
        assert payload[0]['sum_with_invoice'] == 0

        assert payload[1]['id'] == annex2.id
        assert payload[1]['company_name'] == 'N/A'
        assert payload[1]['request_no'] == '123'
        assert payload[1]['contract_no'] is None
        assert payload[1]['annex_no'] == 2
        assert payload[1]['sales_manager'] == sales_manager.id
        assert payload[1]['payment_terms'] == '1'
        assert payload[1]['contract_type'] == annex2.contract.type
        assert payload[1]['sum_no_invoice'] == 0
        assert payload[1]['sum_with_invoice'] == 2 * 1.18

    def test_annex_create(self, apiclient, admin_user, sales_manager):

        contract = TradeAgreement.objects.create(plant_name='plant', sales_manager=sales_manager,
                                                 due_date=timezone.now(), type=BaseContract.Type.TRADE)

        unit = UnitOfMeasure.objects.create(name='KQ')


        apiclient.force_login(admin_user)
        response = apiclient.post(reverse('api:v1:annexes-list'),
                                  data={
                                      'contract': contract.id,
                                      'request_no': '123',
                                      'annex_date': timezone.now(),
                                      'payment_terms': 'payment terms',
                                      'delivery_terms': 'delivery terms',
                                      'acquisition_terms': 'acquisition terms',
                                      'created': timezone.now(),
                                      'seller': sales_manager.id,
                                      'sales_manager': sales_manager.id,
                                      'with_vat': True,
                                      'products': [
                                          {
                                              'name': '123',
                                              'quantity': 1,
                                              'price': 1,
                                              'total': 1,
                                              'unit': unit.id
                                          },
                                          {
                                              'name': '123q',
                                              'quantity': 11,
                                              'price': 11,
                                              'total': 11,
                                              'unit': unit.id
                                          }
                                      ]

                                  },
                                  format='json'
                                  )

        assert response.status_code == 201, response.json()
        assert BaseAnnex.objects.all().count() == 1

        annex = BaseAnnex.objects.first()

        assert annex.contract.id == contract.id
        assert annex.request_no == '123'
        assert annex.payment_terms == 'payment terms'
        assert annex.delivery_terms == 'delivery terms'
        assert annex.acquisition_terms == 'acquisition terms'
        assert annex.seller.id == sales_manager.id
        assert annex.sales_manager.id == sales_manager.id
        assert annex.products.count() == 2
        assert annex.with_vat is True

    def test_agent_annex_create(self, apiclient, admin_user, sales_manager):

        contract = AgentAgreement.objects.create(plant_name='plant', sales_manager=sales_manager,
                                                 due_date=timezone.now(), type=BaseContract.Type.AGENT, territory='Baku')

        apiclient.force_login(admin_user)
        response = apiclient.post(reverse('api:v1:annexes-list'),
                                  data={
                                      'contract': contract.id,
                                      'created': timezone.now(),
                                      'agent_items': [
                                          {
                                              'client_name': '123',
                                              'invoice_no': '1234',
                                              'date': timezone.now().strftime('%Y-%m-%d'),
                                              'annex_no': 123,
                                              'paids_from_customer': 123,
                                              'agent_reward': 123
                                          },
                                          {
                                              'client_name': '123',
                                              'invoice_no': '1234',
                                              'date': timezone.now().strftime('%Y-%m-%d'),
                                              'annex_no': 123,
                                              'paids_from_customer': 123,
                                              'agent_reward': 123
                                          },
                                      ]

                                  },
                                  format='json'
                                  )

        assert response.status_code == 201, response.json()

    def test_rent_annex_create(self, apiclient, admin_user, sales_manager):

        contract = RentAgreement.objects.create(plant_name='plant', sales_manager=sales_manager,
                                                 due_date=timezone.now(), type=BaseContract.Type.RENT)
        unit = UnitOfMeasure.objects.create(name='KQ')

        apiclient.force_login(admin_user)
        response = apiclient.post(reverse('api:v1:annexes-list'),
                                  data={
                                      'contract': contract.id,
                                      'created': timezone.now(),
                                      'rent_conditions': [
                                          {
                                              'name': 'condition1',

                                          },
                                          {
                                              'name': 'condition2',

                                          },
                                      ],
                                      'rent_items': [
                                          {
                                              'item_name': 'item1',
                                              'term': 1,
                                              'quantity': 1,
                                              'one_day_rent': 1,
                                              'total': 1,
                                              'unit': unit.id
                                          },
                                          {
                                              'item_name': 'item2',
                                              'term': 1,
                                              'quantity': 1,
                                              'one_day_rent': 1,
                                              'total': 1,
                                              'unit': unit.id
                                          },
                                      ]

                                  },
                                  format='json'
                                  )

        assert response.status_code == 201, response.json()


class TestUnitOfMeasureAPIView:

    def test_units_list(self, apiclient, admin_user):

        UnitOfMeasure.objects.create(name='KQ')
        UnitOfMeasure.objects.create(name='Metr')


        apiclient.force_login(admin_user)

        response = apiclient.get(reverse('api:v1:units'))

        assert response.status_code == 200, response.json()
        assert len(response.json()) == 2


class TestAnnexStatusStatAPIView:

    def test_annex_list_vat_status_count(self, apiclient, admin_user, sales_manager):

        contract = TradeAgreement.objects.create(plant_name='plant', sales_manager=sales_manager,
                                                 due_date=timezone.now(),type=BaseContract.Type.TRADE)

        annex = BaseAnnex.objects.create(contract=contract, request_no='1223', annex_date=timezone.now(),
                                         note='122', payment_terms='122', delivery_terms='111', acquisition_terms='133',
                                         seller=sales_manager, sales_manager=sales_manager, annex_no=1)

        annex2 = BaseAnnex.objects.create(contract=contract, request_no='123', annex_date=timezone.now(),
                                          note='1', payment_terms='1', delivery_terms='1', acquisition_terms='1',
                                          seller=sales_manager, sales_manager=sales_manager, annex_no=2, with_vat=True)

        unit = UnitOfMeasure.objects.create(name='w')
        ProductInvoiceItem.objects.create(name='ww', annex=annex, unit=unit, quantity=1, price=1, total=2)
        ProductInvoiceItem.objects.create(name='ww', annex=annex, unit=unit, quantity=1, price=1, total=2)
        ProductInvoiceItem.objects.create(name='ww', annex=annex2, unit=unit, quantity=1, price=1, total=2)


        apiclient.force_login(admin_user)
        response = apiclient.get(reverse('api:v1:annex-status-count'))

        assert response.status_code == 200
        print(response.json())
        assert response.json()['all_count'] == 2
        assert response.json()['with_vat'] == 2 * 1.18
        assert response.json()['vat_free'] == 4
