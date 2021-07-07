from datetime import timedelta

from django.core.files.uploadedfile import SimpleUploadedFile
from django.utils import timezone

from rest_framework.reverse import reverse

from api.main_models.annex import UnitOfMeasure, BaseAnnex, ProductInvoiceItem, POAgreementSupplements
from api.main_models.attachment import ContractAttachment, AnnexAttachment
from api.main_models.contract import BaseContract, TradeAgreement, Company, Bank, BankAccount, ServiceAgreement, \
    Contact, DistributionAgreement, AgentAgreement, OneTimeAgreement, POAgreement
from api.models import Person


def test_login(apiclient, admin_user, PASSWORD):

    admin_user.is_active = True
    admin_user.save()

    response = apiclient.post(reverse('api:v1:login'), data={
        'email': admin_user.email,
        'password': PASSWORD
    })

    assert response.status_code == 200, response.json()


def test_logout(apiclient, admin_user, PASSWORD):

    admin_user.is_active = True

    admin_user.save()

    response = apiclient.post(reverse('api:v1:login'), data={
        'email': admin_user.email,
        'password': PASSWORD
    })

    assert response.status_code == 200, response.json()

    response = apiclient.get(reverse('api:v1:contracts-list'))

    assert response.status_code == 200

    response = apiclient.post(reverse('api:v1:logout'))

    assert response.status_code == 204


class TestContractViewSet:

    def test_contract_list_ok(self, apiclient, admin_user, sales_manager):

        TradeAgreement.objects.create(plant_name='plant', sales_manager=sales_manager, due_date=timezone.now(),
                                      type=BaseContract.Type.TRADE, contract_no='123')


        apiclient.force_login(admin_user)
        response = apiclient.get(reverse('api:v1:contracts-list'))

        assert response.status_code == 200

    def test_contract_attachment_upload(self, apiclient, admin_user, trade_aggrement_base):

        apiclient.force_login(admin_user)
        response = apiclient.post(reverse('api:v1:contracts-upload', args=(trade_aggrement_base.id, 'contract')),
                                    data={'attachment': SimpleUploadedFile("agreement.pdf", b"content")},
                                  format='multipart'
                                  )
        assert response.status_code == 204, response.content
        assert ContractAttachment.objects.count() == 1
        assert ContractAttachment.objects.first().contract_id == trade_aggrement_base.id
        assert ContractAttachment.objects.first().attachment.name.startswith('agreement')

    def test_contract_attachment_annex_upload(self, apiclient, admin_user, trade_aggrement_base):

        apiclient.force_login(admin_user)
        response = apiclient.post(reverse('api:v1:contracts-upload', args=(trade_aggrement_base.id, 'annex')),
                                    data={'attachment': SimpleUploadedFile("agreement.pdf", b"content")},
                                  format='multipart'
                                  )
        assert response.status_code == 204, response.content
        assert AnnexAttachment.objects.count() == 1
        assert AnnexAttachment.objects.first().contract_id == trade_aggrement_base.id
        assert AnnexAttachment.objects.first().attachment.name.startswith('agreement')

    def test_contract_attachment_upload_wrong(self, apiclient, admin_user, trade_aggrement_base):
        apiclient.force_login(admin_user)
        response = apiclient.post(reverse('api:v1:contracts-upload', args=(trade_aggrement_base.id, 'contract')),
                                  data={'attachment': 'lorem'},
                                  format='multipart'
                                  )
        assert response.status_code == 400, response.content
        assert ContractAttachment.objects.count() == 0

    def test_contract_attachments_list(self, apiclient, admin_user, trade_aggrement_base):
        apiclient.force_login(admin_user)

        ContractAttachment.objects.create(
            contract=trade_aggrement_base,
            attachment=SimpleUploadedFile("agreement.pdf", b"content")
        )

        AnnexAttachment.objects.create(
            contract=trade_aggrement_base,
            attachment=SimpleUploadedFile("annex.pdf", b"content")
        )

        response = apiclient.get(reverse('api:v1:contracts-attachments', args=(trade_aggrement_base.id,)))

        assert response.status_code == 200
        payload = response.json()
        assert payload['contracts'] and len(payload['contracts']) == 1, payload
        attachment = payload['contracts'][0]
        assert 'agreement' in attachment['name']
        assert 'agreement' in attachment['url']

        assert payload['annexes'] and len(payload['annexes']) == 1
        annex = payload['annexes'][0]
        assert 'annex' in annex['name']
        assert 'annex' in annex['url']

    def test_contract_attachments_list_only_annex(self, apiclient, admin_user, trade_aggrement_base):
        apiclient.force_login(admin_user)

        AnnexAttachment.objects.create(
            contract=trade_aggrement_base,
            attachment=SimpleUploadedFile("annex.pdf", b"content")
        )

        response = apiclient.get(reverse('api:v1:contracts-attachments', args=(trade_aggrement_base.id,)))

        assert response.status_code == 200
        payload = response.json()
        assert not payload['contracts']
        assert payload['annexes'] and len(payload['annexes']) == 1
        annex = payload['annexes'][0]
        assert 'annex' in annex['name']

    def test_contract_detail_ok(self, apiclient, admin_user, sales_manager):

        t = TradeAgreement.objects.create(plant_name='plant', sales_manager=sales_manager, due_date=timezone.now(),
                                          type=BaseContract.Type.TRADE, contract_no='123')

        annex = BaseAnnex.objects.create(contract=t, annex_date=timezone.now(),
                                         note='122', payment_terms='122', delivery_terms='111', acquisition_terms='133',
                                         seller=sales_manager, sales_manager=sales_manager, annex_no=1)

        annex2 = BaseAnnex.objects.create(contract=t, annex_date=timezone.now(),
                                          note='1', payment_terms='1', delivery_terms='1', acquisition_terms='1',
                                          seller=sales_manager, sales_manager=sales_manager, annex_no=2)

        company = Company.objects.create(type=Company.MMC, name='company_name',
                                         address='company_address', tin='12345')

        t = TradeAgreement.objects.create(plant_name='plant', sales_manager=sales_manager, due_date=timezone.now(),
                                          type=BaseContract.Type.TRADE, contract_no='123', company=company)

        bank = Bank.objects.create(name='bank_name', code='123', tin='1234')

        b_acc = BankAccount.objects.create(account='123', bank=bank, address='address', city='city',
                                           swift_no='swift_123', correspondent_account='cor_123', company_owner=company)

        d = AgentAgreement.objects.create(plant_name='plant', sales_manager=sales_manager, due_date=timezone.now(),
                                  type=BaseContract.Type.TRADE, contract_no='123', company=company, territory='asdf')

        apiclient.force_login(admin_user)
        response = apiclient.get(reverse('api:v1:contracts-detail', args=[t.id]))

        assert response.status_code == 200, response.json()

    def test_trade_edit(self, apiclient, admin_user, sales_manager, responsible_person, executor, company):

        t = TradeAgreement.objects.create(plant_name='plant', sales_manager=sales_manager, due_date=timezone.now(),
                                          type=BaseContract.Type.SERVICE, contract_no='1234', company=company,
                                          executor=executor, responsible_person=responsible_person)

        bank = Bank.objects.create(name='bank_name', code='123', tin='1234')

        BankAccount.objects.create(account='123', bank=bank, address='address', city='city1',
                                   swift_no='swift_123', correspondent_account='cor_123', company_owner=company)

        apiclient.force_login(admin_user)

        response = apiclient.put(reverse('api:v1:contracts-detail', args=[t.id]),
                                 data={
                                     'contract_no': '123',
                                     'type': BaseContract.Type.TRADE,
                                     'sales_manager': sales_manager.id,
                                     'due_date': timezone.now(),
                                     'company': {
                                         'name': 'My_company',
                                         'type': Company.ASC,
                                         'tin': '1234567890',
                                         'address': 'My_address',
                                     },
                                     'executor': {
                                          'first_name': 'First1',
                                          'last_name': 'Last1',
                                          'fathers_name': 'Father1',
                                     },
                                     'responsible_person': {
                                          'first_name': 'First',
                                          'last_name': 'Last',
                                          'fathers_name': 'Father',
                                     },
                                     'contact': {
                                        'mobile': '1234567890',
                                        'address': 'My_address',
                                        'work_email': 'My_work_email@email.fake',
                                        'personal_email': 'My_personal_email@email.fake'

                                     },
                                     'bank_account': {
                                        'account': 'My_account',
                                        'swift_no': '1234567890',
                                        'correspondent_account': 'My_correspondent_account',
                                        'city': 'city',
                                        'address': 'address',
                                     },
                                     'bank': {
                                        'name': 'My_bank',
                                        'code': '1234567890',
                                        'tin': '1234567890'
                                     }

                                  },
                                 format='json'
                                 )

        assert response.status_code == 200, response.json()

        t.refresh_from_db()
        t.executor.refresh_from_db()

        assert t.contract_no == '123'
        assert t.company.name == 'My_company'
        assert t.company.type == Company.ASC
        assert t.company.tin == '1234567890'
        assert t.company.address == 'My_address'

        assert t.executor.first_name == 'First1'
        assert t.executor.last_name == 'Last1'
        assert t.executor.fathers_name == 'Father1'
        assert t.executor.fullname == 'First1 Last1'

        assert t.responsible_person.first_name == 'First'
        assert t.responsible_person.last_name == 'Last'
        assert t.responsible_person.fathers_name == 'Father'
        assert t.responsible_person.fullname == 'First Last'

        assert t.responsible_person.contact.mobile == '1234567890'
        assert t.responsible_person.contact.address == 'My_address'
        assert t.responsible_person.contact.work_email == 'My_work_email@email.fake'
        assert t.responsible_person.contact.personal_email == 'My_personal_email@email.fake'

        assert t.company.bank_acc_list.last().account == 'My_account'
        assert t.company.bank_acc_list.last().swift_no == '1234567890'
        assert t.company.bank_acc_list.last().correspondent_account == 'My_correspondent_account'
        assert t.company.bank_acc_list.last().city == 'city'
        assert t.company.bank_acc_list.last().address == 'address'

        assert t.company.bank_acc_list.last().bank.name == 'My_bank'
        assert t.company.bank_acc_list.last().bank.code == '1234567890'
        assert t.company.bank_acc_list.last().bank.tin == '1234567890'

    def test_po_edit(self, apiclient, admin_user, sales_manager, company):

        po = POAgreement.objects.create(plant_name='plant', sales_manager=sales_manager, due_date=timezone.now(),
                                        type=BaseContract.Type.PO, contract_no='1234', company=company, po_number='2')
        s1 = POAgreementSupplements.objects.create(supplement_no='123', agreement=po)
        s2 = POAgreementSupplements.objects.create(supplement_no='1234', agreement=po)

        apiclient.force_login(admin_user)
        response = apiclient.put(reverse('api:v1:contracts-detail', args=[po.id]),
                                 data={
                                     'id': po.id,
                                     'po_number': "5656565655",
                                     'due_date': "2021-05-24T09:16:56.522Z",
                                     'created': "2021-05-24T09:16:56.522Z",
                                     'company': {'id': company.id,
                                                 'type': None,
                                                 'name': "qw",
                                                 'address': None,
                                                 'tin': None,
                                                 'email': None},
                                     'sales_manager': sales_manager.id,
                                     'supplements': [{'supplement_no': "003", 'id': s1.id},
                                                     {'supplement_no': "323", 'id': s2.id},
                                                     {'supplement_no': "423"}],
                                     'type': BaseContract.Type.PO
                                 },
                                 format='json'
                                 )
        assert response.status_code == 200, response.json()

        s1.refresh_from_db()
        s2.refresh_from_db()
        po.refresh_from_db()

        assert s1.supplement_no == '003'
        assert s2.supplement_no == '323'
        assert po.po_number == '5656565655'
        assert po.company.name == 'qw'

    def test_contract_destroy(self, apiclient, admin_user, sales_manager):

        t = TradeAgreement.objects.create(plant_name='plant', sales_manager=sales_manager,
                                          type=BaseContract.Type.TRADE, contract_no='123')

        apiclient.force_login(admin_user)
        response = apiclient.delete(reverse('api:v1:contracts-detail', args=[t.id]))

        assert response.status_code == 200, response.json()
        assert response.json()['id'] == t.id
        assert response.json()['status'] == BaseContract.Status.EXPIRED

        t.refresh_from_db()
        assert t.status == BaseContract.Status.EXPIRED

    def test_po_create(self, apiclient, admin_user, sales_manager):

        apiclient.force_login(admin_user)
        response = apiclient.post(reverse('api:v1:contracts-list'),
                                  data={
                                      "due_date":"2021-05-16T13:14:03.488Z",
                                        "created":"2021-05-16T13:14:03.488Z",

                                        "supplements":[{"supplement_no":"dsf"},
                                                       {"supplement_no":"qqdsf"}],

                                        "po_number":"sdf",
                                        "sales_manager":sales_manager.id,
                                        "company":{"name":"dsf"},

                                      "type":BaseContract.Type.PO},
                                  format='json'
                                  )

        assert response.status_code == 201, response.json()

    def test_agent_create(self, apiclient, admin_user, sales_manager):

        apiclient.force_login(admin_user)

        response = apiclient.post(reverse('api:v1:contracts-list'),
                                  data={
                                      'contract_no': 123,
                                      'type': BaseContract.Type.AGENT,
                                      'sales_manager': sales_manager.id,
                                      'due_date': timezone.now(),
                                      'territory': 'baku',

                                      'executor': {
                                          'first_name': 'First',
                                          'last_name': 'Last',
                                          'fathers_name': 'Father',
                                          'tin': '12345'
                                      },
                                      'responsible_person': {
                                          'first_name': 'First',
                                          'last_name': 'Last',
                                          'fathers_name': 'Father',
                                      },
                                      'contact': {
                                          'mobile': '1234567890',
                                          'address': 'My_address',
                                          'work_email': 'My_work_email@email.fake',
                                          'personal_email': 'My_personal_email@email.fake'

                                      },
                                      'bank': {
                                          'name': 'My_bank',
                                          'code': '1234567890',
                                      },
                                      'bank_account': {
                                          'default': True,
                                          'account': 'My_account',
                                          'swift_no': '1234567890',
                                          'correspondent_account': 'My_correspondent_account',
                                          'city': 'city',
                                          'address': 'address'
                                      }

                                  },
                                  format='json'
                                  )

        assert response.status_code == 201, response.json()

    def test_trade_create(self, apiclient, admin_user, sales_manager):

        apiclient.force_login(admin_user)
        response = apiclient.post(reverse('api:v1:contracts-list'),
                                  data={
                                      'contract_no': 123,
                                      'type': BaseContract.Type.TRADE,
                                      'sales_manager': sales_manager.id,
                                      'due_date': timezone.now(),
                                      'company': {
                                          'name': 'My_company',
                                          'type': Company.MMC,
                                          'tin': '1234567890',
                                          'address': 'My_address'
                                      },
                                      'executor': {
                                          'first_name': 'First',
                                          'last_name': 'Last',
                                          'fathers_name': 'Father',
                                      },
                                      'responsible_person': {
                                          'first_name': 'First',
                                          'last_name': 'Last',
                                          'fathers_name': 'Father',
                                      },
                                      'contact': {
                                          'mobile': '1234567890',
                                          'address': 'My_address',
                                          'work_email': 'My_work_email@email.fake',
                                          'personal_email': 'My_personal_email@email.fake'

                                      },
                                      'bank': {
                                          'name': 'My_bank',
                                          'code': '1234567890',
                                          'tin': '1234567890'
                                      },
                                      'bank_account': {
                                          'default': True,
                                          'account': 'My_account',
                                          'swift_no': '1234567890',
                                          'correspondent_account': 'My_correspondent_account',
                                          'city': 'city',
                                          'address': 'address'
                                      }

                                  },
                                  format='json'
                                  )

        assert response.status_code == 201, response.json()

        assert TradeAgreement.objects.all().count() == 1

        trade_agr = TradeAgreement.objects.first()

        assert trade_agr.contract_no == '123'
        assert trade_agr.sales_manager.id == sales_manager.id

        company = trade_agr.company

        assert company.name == 'My_company'
        assert company.type == Company.MMC
        assert company.tin == '1234567890'
        assert company.address == 'My_address'

        executor = trade_agr.executor

        assert executor.first_name == 'First'
        assert executor.last_name == 'Last'
        assert executor.fathers_name == 'Father'

        responsible_person = trade_agr.responsible_person

        assert responsible_person.first_name == 'First'
        assert responsible_person.last_name == 'Last'
        assert responsible_person.fathers_name == 'Father'

        contact = responsible_person.contact

        assert contact.mobile == '1234567890'
        assert contact.address == 'My_address'
        assert contact.work_email == 'My_work_email@email.fake'
        assert contact.personal_email == 'My_personal_email@email.fake'

        assert BankAccount.objects.filter(company_owner=company).count() == 1

        bank_acc = BankAccount.objects.filter(company_owner=company).first()

        assert bank_acc.default is True
        assert bank_acc.account == 'My_account'
        assert bank_acc.swift_no == '1234567890'
        assert bank_acc.correspondent_account == 'My_correspondent_account'
        assert bank_acc.address == 'address'
        assert bank_acc.city == 'city'

        bank = bank_acc.bank

        assert bank.name == 'My_bank'
        assert bank.code == '1234567890'
        assert bank.tin == '1234567890'

    def test_one_time_create(self, apiclient, admin_user, sales_manager):

        apiclient.force_login(admin_user)

        unit = UnitOfMeasure.objects.create(name='asdf')

        response = apiclient.post(reverse('api:v1:contracts-list'),
                                  data={
                                      'type': BaseContract.Type.ONE_TIME,
                                      'sales_manager': sales_manager.id,

                                      'company': {
                                          'name': 'My_company',
                                          'type': Company.MMC,
                                          'tin': '1234567890',
                                          'address': 'My_address'
                                      },
                                      'executor': {
                                          'first_name': 'First',
                                          'last_name': 'Last',
                                          'fathers_name': 'Father',
                                          'position': 'asdf'
                                      },
                                      'executor_contact': {
                                          'mobile': '1234567890',
                                          'personal_email': 'My_personal_email@email.fake'
                                      },
                                      'annex': {
                                          'request_no': 'asdf',
                                          'payment_terms':'asdf',
                                          'delivery_terms': 'asdf',
                                          'acquisition_terms': 'asdf',
                                          'seller': {
                                              'first_name': 'First',
                                              'last_name': 'Last',
                                              'fathers_name': 'Father',
                                              'position': 'asdf'
                                          },
                                          'products': [
                                              {
                                                  'name': 'asdf',
                                                  'unit': unit.id,
                                                  'quantity': 1,
                                                  'price': 1,
                                                  'total': 2
                                              },
                                              {
                                                  'name': 'asdf',
                                                  'unit': unit.id,
                                                  'quantity': 1,
                                                  'price': 1,
                                                  'total': 2
                                              }
                                          ]
                                      },
                                      'price_offer': 'asdf',
                                      'price_offer_validity': 'asdf',
                                      'warranty_period': 'asdf',
                                      'unpaid_period': 'asdf',
                                      'unpaid_value': 'asdf',
                                      'part_payment': 'asdf',
                                      'part_acquisition': 'asdf',
                                      'standard': 'asdf',
                                      'final_amount_with_writing': 'asdf'
                                  },
                                  format='json'
                                  )

        assert response.status_code == 201, response.json()

    def test_one_time_create_not_fields(self, apiclient, admin_user):

        apiclient.force_login(admin_user)

        unit = UnitOfMeasure.objects.create(name='asdf')

        response = apiclient.post(reverse('api:v1:contracts-list'),
                                  data={
                                      'type': BaseContract.Type.ONE_TIME
                                  },
                                  format='json'
                                  )

        assert response.status_code == 201, response.json()

    def test_one_time_edit(self, apiclient, admin_user, sales_manager):

        seller = Person.objects.create(
            type=Person.TYPE.SELLER,
            first_name='First11',
            last_name='Last11',
            fathers_name='Father111',
        )

        unit = UnitOfMeasure.objects.create(name='asdf')
        company = Company.objects.create(type=Company.MMC, name='company_name',
                                         address='company_address', tin='12345')
        contact = Contact.objects.create(mobile='12345', address='my_address',
                                         personal_email='personal_email@email.email', web_site='my_site.site')
        executor = Person.objects.create(
            type=Person.TYPE.SELLER,
            first_name='First112',
            last_name='Last112',
            fathers_name='Father1112',
            contact=contact
        )

        contract = OneTimeAgreement.objects.create(plant_name='plant', sales_manager=sales_manager,
                                                   due_date=timezone.now(), type=BaseContract.Type.ONE_TIME,
                                                   final_amount_with_writing='1', price_offer='1', warranty_period='1',
                                                   price_offer_validity='1', unpaid_period='1', unpaid_value='1',
                                                   part_payment='1', part_acquisition='1', standard='1', company=company,
                                                   executor=executor)

        annex = BaseAnnex.objects.create(contract=contract, request_no='1223', annex_date=timezone.now(),
                                         note='122', payment_terms='122', delivery_terms='111', acquisition_terms='133',
                                         seller=sales_manager, sales_manager=sales_manager, annex_no=1)

        p1 = ProductInvoiceItem.objects.create(name='ww', annex=annex, unit=unit, quantity=1, price=1, total=2)
        p2 = ProductInvoiceItem.objects.create(name='ww', annex=annex, unit=unit, quantity=1, price=1, total=2)

        apiclient.force_login(admin_user)

        response = apiclient.put(reverse('api:v1:contracts-detail', args=[contract.id]), data={

            "annex": {
                "request_no": "huquqi",
                "payment_terms": "huquqi",
                "delivery_terms": "huquqi",
                "acquisition_terms": None,
                "seller": {
                    'id': seller.id,
                    "first_name": "huquqi",
                    "last_name": "huquqi",
                    "fathers_name": "huquqi",
                    "tin": None,
                    "position": "huquqi"},
                "products": [{"name": "huquqi", "unit": unit.id, "quantity": 1, "price": 2, "total": 2},
                             {"name": "huquqi", "unit": unit.id, "quantity": 1, "price": 1, "total": 1},
                             {"name": "huquqi", "unit": unit.id, "quantity": 1, "price": 1, "total": 1}]},

            "id": contract.id,
            "due_date": timezone.now(),
            "created": timezone.now(),
            "executor": {
                'id': executor.id,
                "first_name": "huquqi",
                "last_name": "huquqi",
                "fathers_name": "huquqi",
                "position": None,
                "contact":{
                    'id': contact.id,
                    "mobile": "huquqi",
                    "address": None,
                    "work_email": None,
                    "personal_email": "huquqi",
                    "web_site": None},
                "type": 0,
                "tin": None,
            },
            "part_payment":"huquqi",
            "final_amount_with_writing": "huquqi",
            "part_acquisition": "huquqi",
            "price_offer": "huquqi",
            "standard": "huquqi",
            "price_offer_validity": "huquqi",
            "unpaid_period": "huquqi",
            "unpaid_value": "huquqi",
            "warranty_period": "huquqi",
            "sales_manager": sales_manager.id,
            "company":{
                "id":company.id,
                "type":None,
                "name":"huquqi",
                "address":None,
                "tin":"huquqi",
                "email":None},
            "type": BaseContract.Type.ONE_TIME
        }
                                 ,
                                  format='json'
                                  )

        assert response.status_code == 200, response.json()

        contract.refresh_from_db()

        assert contract.final_amount_with_writing == 'huquqi'
        assert ProductInvoiceItem.objects.all().count() == 3


class TestContactViewSet:

    def test_contact_list_ok(self, apiclient, admin_user):

        sales_manager = Person.objects.create(type=Person.TYPE.SALES_MANAGER, first_name='First', last_name='Last',
                                              fathers_name='Father')

        company = Company.objects.create(type=Company.MMC, name='company_name',
                                         address='company_address', tin='12345')

        contact = Contact.objects.create(mobile='12345', address='my_address',
                                         personal_email='personal_email@email.email', web_site='my_site.site')

        rp = Person.objects.create(type=Person.TYPE.CONTACT, first_name='First', last_name='Last',
                                   fathers_name='Father', contact=contact)

        TradeAgreement.objects.create(plant_name='plant', sales_manager=sales_manager, due_date=timezone.now(),
                                      type=BaseContract.Type.TRADE, company=company, responsible_person=rp)

        contact1 = Contact.objects.create(mobile='123456', address='my_address1',
                                          personal_email='personal_email@email.email1', web_site='my_site.site1')

        rp1 = Person.objects.create(type=Person.TYPE.CONTACT, first_name='First1', last_name='Last1',
                                    fathers_name='Father1', contact=contact1)

        TradeAgreement.objects.create(plant_name='plant', sales_manager=sales_manager, due_date=timezone.now(),
                                      type=BaseContract.Type.TRADE, company=company, responsible_person=rp1)

        apiclient.force_login(admin_user)
        response = apiclient.get(reverse('api:v1:contacts-list'))

        assert response.status_code == 200, response.json()
        payload = response.json()
        assert len(payload) == 2

        assert payload[0]['customer'] == 'company_name'
        assert payload[0]['address'] == 'my_address'
        assert payload[0]['responsible_person'] == 'First Last'
        assert payload[0]['mobile'] == '12345'
        assert payload[0]['personal_email'] == 'personal_email@email.email'
        assert payload[0]['web_site'] == 'my_site.site'

        assert payload[1]['customer'] == 'company_name'
        assert payload[1]['address'] == 'my_address1'
        assert payload[1]['responsible_person'] == 'First1 Last1'
        assert payload[1]['mobile'] == '123456'
        assert payload[1]['personal_email'] == 'personal_email@email.email1'
        assert payload[1]['web_site'] == 'my_site.site1'

    def test_contact_create(self, apiclient, admin_user):

        admin_user.plant_name = 'plant'
        admin_user.save()

        apiclient.force_login(admin_user)
        response = apiclient.post(reverse('api:v1:contacts-list'),
                                  data={
                                      'mobile': "1234",
                                      'address': "address",
                                      'work_email': "w_email",
                                      'personal_email': "p_email",
                                      'web_site': "w_site",
                                      'responsible_person': {'first_name': "name",
                                                             'last_name': "",
                                                             'fathers_name': "",
                                                             'position': ""}
                                  },
                                  format='json'
                                  )

        assert response.status_code == 201, response.json()
        assert Contact.objects.all().count() == 1

        contact = Contact.objects.first()

        assert contact.person.first_name == 'name'

        assert contact.mobile == '1234'
        assert contact.address == 'address'
        assert contact.work_email == 'w_email'
        assert contact.personal_email == 'p_email'
        assert contact.web_site == 'w_site'
        assert contact.plant_name == 'plant'

    def test_contact_update(self, apiclient, admin_user, responsible_person):

        admin_user.plant_name = 'plant'
        admin_user.save()
        contact = responsible_person.contact
        contact.plant_name = 'plant'
        contact.save()

        apiclient.force_login(admin_user)

        response = apiclient.put(reverse('api:v1:contacts-detail', args=[contact.id]),
                                 data={
                                     'mobile': "1234",
                                     'address': "address",
                                     'work_email': "w_email",
                                     'personal_email': "p_email",
                                     'web_site': "w_site",
                                     'responsible_person': {'first_name': "name",
                                                            'last_name': "",
                                                            'fathers_name': "",
                                                            'position': ""}
                                 },
                                 format='json'
                                 )

        assert response.status_code == 200, response.json()
        assert Contact.objects.all().count() == 1

        contact = Contact.objects.first()

        assert contact.person.first_name == 'name'

        assert contact.mobile == '1234'
        assert contact.address == 'address'
        assert contact.work_email == 'w_email'
        assert contact.personal_email == 'p_email'
        assert contact.web_site == 'w_site'
        assert contact.plant_name == 'plant'


class TestBankViewSet:

    def test_bank_list_ok(self, apiclient, admin_user, sales_manager):

        company = Company.objects.create(type=Company.MMC, name='company_name',
                                         address='company_address', tin='12345')
        contract = TradeAgreement.objects.create(plant_name='plant', sales_manager=sales_manager,
                                                 due_date=timezone.now(), type=BaseContract.Type.TRADE, company=company)

        bank = Bank.objects.create(name='bank_name', code='123', tin='1234')
        bank1 = Bank.objects.create(name='bank_name1', code='321', tin='4321')

        BankAccount.objects.create(account='123', bank=bank, address='address', city='city',
                                   swift_no='swift_123', correspondent_account='cor_123', company_owner=company)

        BankAccount.objects.create(account='1234', bank=bank1, address='address1', city='city1',
                                   swift_no='swift_1234', correspondent_account='cor_1234', company_owner=company)

        apiclient.force_login(admin_user)
        response = apiclient.get(reverse('api:v1:banks-list'))

        assert response.status_code == 200, response.json()
        payload = response.json()
        assert len(payload) == 2

        assert payload[1]['name'] == 'bank_name'
        assert payload[1]['code'] == '123'
        assert payload[1]['tin'] == '1234'
        assert payload[1]['address'] == 'address'
        assert payload[1]['city'] == 'city'
        assert payload[1]['swift_no'] == 'swift_123'
        assert payload[1]['correspondent_account'] == 'cor_123'

        assert payload[0]['name'] == 'bank_name1'
        assert payload[0]['code'] == '321'
        assert payload[0]['tin'] == '4321'
        assert payload[0]['address'] == 'address1'
        assert payload[0]['city'] == 'city1'
        assert payload[0]['swift_no'] == 'swift_1234'
        assert payload[0]['correspondent_account'] == 'cor_1234'


class TestSalesMangerApiView:

    def test_sales_list_ok(self, apiclient, admin_user, sales_manager):

        sales_manager1 = Person.objects.create(
            type=Person.TYPE.SALES_MANAGER,
            first_name='First1',
            last_name='Last1',
            fathers_name='Father1'
        )

        apiclient.force_login(admin_user)
        response = apiclient.get(reverse('api:v1:sales-managers'))

        assert response.status_code == 200, response.json()
        assert len(response.json()) == 2
        payload = response.json()

        assert payload[0]['id'] == sales_manager.id
        assert payload[0]['fullname'] == sales_manager.fullname

        assert payload[1]['id'] == sales_manager1.id
        assert payload[1]['fullname'] == sales_manager1.fullname


class TestContractFilterSet:

    def test_contract_list_filter_by_contract_no(self, apiclient, admin_user, sales_manager):
        TradeAgreement.objects.create(plant_name='plant', sales_manager=sales_manager, due_date=timezone.now(),
                                      type=BaseContract.Type.TRADE, contract_no='123')

        TradeAgreement.objects.create(plant_name='plant', sales_manager=sales_manager, due_date=timezone.now(),
                                      type=BaseContract.Type.TRADE, contract_no='12')

        apiclient.force_login(admin_user)
        response = apiclient.get(reverse('api:v1:contracts-list') + '?contract_no=123')

        assert response.status_code == 200
        assert len(response.json()) == 1
        assert response.json()[0]['contract_no'] == '123'

    def test_contract_list_filter_status(self, apiclient, admin_user, sales_manager):
        TradeAgreement.objects.create(plant_name='plant', sales_manager=sales_manager,
                                      type=BaseContract.Type.TRADE, contract_no='123',
                                      status=BaseContract.Status.IN_PROCESS)

        TradeAgreement.objects.create(plant_name='plant', sales_manager=sales_manager,
                                      type=BaseContract.Type.TRADE, contract_no='12',
                                      status=BaseContract.Status.APPROVED)

        apiclient.force_login(admin_user)
        response = apiclient.get(reverse('api:v1:contracts-list') + f'?status={BaseContract.Status.APPROVED}')

        assert response.status_code == 200
        assert len(response.json()) == 1
        assert response.json()[0]['status'] == BaseContract.Status.APPROVED

    def test_contract_list_filter_by_type(self, apiclient, admin_user, sales_manager):
        TradeAgreement.objects.create(plant_name='plant', sales_manager=sales_manager, due_date=timezone.now(),
                                      type=BaseContract.Type.TRADE, contract_no='123')

        ServiceAgreement.objects.create(plant_name='plant', sales_manager=sales_manager, due_date=timezone.now(),
                                        type=BaseContract.Type.SERVICE, contract_no='12')

        apiclient.force_login(admin_user)
        response = apiclient.get(reverse('api:v1:contracts-list') + f'?type={BaseContract.Type.TRADE}')

        assert response.status_code == 200
        assert len(response.json()) == 1
        assert response.json()[0]['type'] == 1

    def test_contract_list_filter_by_sales_manager(self, apiclient, admin_user, sales_manager):
        TradeAgreement.objects.create(plant_name='plant', sales_manager=sales_manager, due_date=timezone.now(),
                                      type=BaseContract.Type.TRADE, contract_no='123')

        ServiceAgreement.objects.create(plant_name='plant', due_date=timezone.now(),
                                        type=BaseContract.Type.SERVICE, contract_no='12')

        apiclient.force_login(admin_user)
        response = apiclient.get(reverse('api:v1:contracts-list') + f'?sales_manager={sales_manager.first_name}')

        assert response.status_code == 200
        assert len(response.json()) == 1
        assert response.json()[0]['sales_manager'] == 'First Last'  # fullname

    def test_contract_list_filter_by_company_name(self, apiclient, admin_user, sales_manager):
        company = Company.objects.create(type=Company.MMC, name='company_name', address='company_address', tin='12345')

        TradeAgreement.objects.create(plant_name='plant', sales_manager=sales_manager, due_date=timezone.now(),
                                      type=BaseContract.Type.TRADE, contract_no='123', company=company)

        ServiceAgreement.objects.create(plant_name='plant', sales_manager=sales_manager, due_date=timezone.now(),
                                        type=BaseContract.Type.SERVICE, contract_no='12')


        apiclient.force_login(admin_user)
        response = apiclient.get(reverse('api:v1:contracts-list') + '?company_name=company_name')

        assert response.status_code == 200, response.json()
        assert len(response.json()) == 1
        assert response.json()[0]['company_name'] == 'company_name'

    def test_contract_list_filter_created(self, apiclient, admin_user, sales_manager):

        created = timezone.now() - timedelta(days=1)

        TradeAgreement.objects.create(plant_name='plant', sales_manager=sales_manager, due_date=timezone.now(),
                                      type=BaseContract.Type.TRADE, contract_no='123',
                                      status=BaseContract.Status.IN_PROCESS, created=created)

        TradeAgreement.objects.create(plant_name='plant', sales_manager=sales_manager, due_date=timezone.now(),
                                      type=BaseContract.Type.TRADE, contract_no='12',
                                      status=BaseContract.Status.APPROVED)

        apiclient.force_login(admin_user)
        today = timezone.now().strftime('%Y-%m-%d')

        response = apiclient.get(reverse('api:v1:contracts-list') + f'?created={today}')

        assert response.status_code == 200, response.json()
        assert len(response.json()) == 1

    def test_contract_list_filter_created_range(self, apiclient, admin_user, sales_manager):

        yesterday = timezone.now() - timedelta(days=1)
        tomorrow = timezone.now() + timedelta(days=1)

        two_days_ago = timezone.now() - timedelta(days=2)
        after_two_days = timezone.now() + timedelta(days=2)

        today = timezone.now()

        TradeAgreement.objects.create(plant_name='plant', sales_manager=sales_manager, due_date=timezone.now(),
                                      type=BaseContract.Type.TRADE, contract_no='123',
                                      status=BaseContract.Status.IN_PROCESS, created=two_days_ago)

        TradeAgreement.objects.create(plant_name='plant', sales_manager=sales_manager, due_date=timezone.now(),
                                      type=BaseContract.Type.CUSTOMER, contract_no='12',
                                      status=BaseContract.Status.APPROVED, created=after_two_days)

        TradeAgreement.objects.create(plant_name='plant', sales_manager=sales_manager, due_date=timezone.now(),
                                      type=BaseContract.Type.TRADE, contract_no='123',
                                      status=BaseContract.Status.IN_PROCESS)

        yesterday = yesterday.strftime('%Y-%m-%d')
        tomorrow = tomorrow.strftime('%Y-%m-%d')

        apiclient.force_login(admin_user)

        response = apiclient.get(reverse('api:v1:contracts-list') +
                                 f'?contract_created_after={yesterday}'
                                 f'&contract_created_before={tomorrow}')

        assert response.status_code == 200, response.json()

        assert len(response.json()) == 1

        assert response.json()[0]['created'][0:10] == today.strftime('%Y-%m-%d')

    def test_contract_list_filter_status_expires(self, apiclient, admin_user, sales_manager):

        tomorrow = timezone.now() + timedelta(days=1)

        ta1 = TradeAgreement.objects.create(plant_name='plant', sales_manager=sales_manager, due_date=tomorrow,
                                            type=BaseContract.Type.TRADE, contract_no='123',
                                            status=BaseContract.Status.IN_PROCESS)

        three_weeks_for_expire = timezone.now() + timedelta(weeks=3)

        ta = TradeAgreement.objects.create(plant_name='plant', sales_manager=sales_manager, due_date=three_weeks_for_expire,
                                           type=BaseContract.Type.TRADE, contract_no='12',
                                           status=BaseContract.Status.APPROVED)

        apiclient.force_login(admin_user)
        response = apiclient.get(reverse('api:v1:contracts-list') + f'?status={3}')

        assert response.status_code == 200, response.json()
        assert len(response.json()) == 1
        assert response.json()[0]['id'] == ta1.id
        assert response.json()[0]['status'] == 3 # Expires


class TestContractStatusStatAPIView:

    def test_contract_status_stat(self, apiclient, admin_user, sales_manager):

        three_weeks_for_expire = timezone.now() + timedelta(weeks=3)

        TradeAgreement.objects.create(plant_name='plant', sales_manager=sales_manager,
                                      due_date=timezone.now(),
                                      type=BaseContract.Type.TRADE, contract_no='12',
                                      status=BaseContract.Status.IN_PROCESS)

        TradeAgreement.objects.create(plant_name='plant', sales_manager=sales_manager,
                                      due_date=timezone.now(),
                                      type=BaseContract.Type.TRADE, contract_no='12',
                                      status=BaseContract.Status.IN_PROCESS)

        TradeAgreement.objects.create(plant_name='plant', sales_manager=sales_manager,
                                      due_date=three_weeks_for_expire,
                                      type=BaseContract.Type.TRADE, contract_no='12',
                                      status=BaseContract.Status.EXPIRED)
        TradeAgreement.objects.create(plant_name='plant', sales_manager=sales_manager,
                                      due_date=three_weeks_for_expire,
                                      type=BaseContract.Type.TRADE, contract_no='12',
                                      status=BaseContract.Status.APPROVED)
        TradeAgreement.objects.create(plant_name='plant', sales_manager=sales_manager,
                                      due_date=three_weeks_for_expire,
                                      type=BaseContract.Type.TRADE, contract_no='12',
                                      status=BaseContract.Status.APPROVED)

        TradeAgreement.objects.create(plant_name='plant', sales_manager=sales_manager,
                                      due_date=three_weeks_for_expire,
                                      type=BaseContract.Type.TRADE, contract_no='12',
                                      status=BaseContract.Status.IN_PROCESS)

        apiclient.force_login(admin_user)
        response = apiclient.get(reverse('api:v1:status-count'))

        assert response.status_code == 200, response.json()
        assert response.json()['all_count'] == 6
        assert response.json()['in_process_count'] == 1
        assert response.json()['approved_count'] == 2
        assert response.json()['expired_count'] == 1
        assert response.json()['expires_in_2_weeks'] == 2


class TestContactFilterSet:

    def test_contacts_filter_responsible_person(self, apiclient, admin_user):

        sales_manager = Person.objects.create(type=Person.TYPE.SALES_MANAGER, first_name='First', last_name='Last',
                                              fathers_name='Father')

        company = Company.objects.create(type=Company.MMC, name='company_name',
                                         address='company_address', tin='12345')

        contact = Contact.objects.create(mobile='12345', address='my_address',
                                         personal_email='personal_email@email.email',web_site='my_site.site')

        rp = Person.objects.create(type=Person.TYPE.CONTACT, first_name='First', last_name='Last',
                                   fathers_name='Father', contact=contact)

        TradeAgreement.objects.create(plant_name='plant', sales_manager=sales_manager, due_date=timezone.now(),
                                      type=BaseContract.Type.TRADE, company=company, responsible_person=rp)

        contact1 = Contact.objects.create(mobile='123456', address='my_address1',
                                          personal_email='personal_email@email.email1', web_site='my_site.site1')

        rp1 = Person.objects.create(type=Person.TYPE.CONTACT, first_name='First1', last_name='Last1',
                                    fathers_name='Father1', contact=contact1)

        TradeAgreement.objects.create(plant_name='plant', sales_manager=sales_manager, due_date=timezone.now(),
                                      type=BaseContract.Type.TRADE, company=company, responsible_person=rp1)

        apiclient.force_login(admin_user)
        response = apiclient.get(reverse('api:v1:contacts-list') + '?responsible_person=first1')

        assert response.status_code == 200, response.json()
        payload = response.json()
        assert len(payload) == 1
        assert payload[0]['responsible_person'] == 'First1 Last1'
