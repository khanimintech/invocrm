from django.utils import timezone

from rest_framework.reverse import reverse
from api.main_models.contract import BaseContract, TradeAgreement, Company, Bank, BankAccount, ServiceAgreement, Contact
from api.models import Person


def test_login(apiclient, admin_user, PASSWORD):

    admin_user.is_active = True
    admin_user.save()
    response = apiclient.post(reverse('api:v1:login'), data={
        'email': admin_user.email,
        'password': PASSWORD
    })

    assert response.status_code == 200, response.json()


class TestContractViewSet:

    def test_contract_list_ok(self, apiclient, admin_user, sales_manager):

        TradeAgreement.objects.create(plant_name='plant', sales_manager=sales_manager, due_date=timezone.now(),
                                      type=BaseContract.Type.TRADE, contract_no='123')

        admin_user.plant_name = 'plant'
        admin_user.save()
        apiclient.force_login(admin_user)
        response = apiclient.get(reverse('api:v1:contracts-list') + '?contract_no=123')

        assert response.status_code == 200

    def test_trade_create(self, apiclient, admin_user, sales_manager):

        admin_user.plant_name = 'plant'
        admin_user.save()
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
                                          'correspondent_account': 'My_correspondent_account'
                                      }

                                  },
                                  format='json'
                                  )

        assert response.status_code == 201

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

        bank = bank_acc.bank

        assert bank.name == 'My_bank'
        assert bank.code == '1234567890'
        assert bank.tin == '1234567890'


class TestContactViewSet:

    def test_contact_list_ok(self, apiclient, admin_user):

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

        admin_user.plant_name = 'plant'
        admin_user.save()
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


class TestBankViewSet:

    def test_bank_list_ok(self, apiclient, admin_user):

        bank = Bank.objects.create(name='bank_name', code='123', tin='1234')
        bank1 = Bank.objects.create(name='bank_name1', code='321', tin='4321')

        BankAccount.objects.create(account='123', bank=bank, address='address', city='city',
                                   swift_no='swift_123', correspondent_account='cor_123')

        BankAccount.objects.create(account='1234', bank=bank1, address='address1', city='city1',
                                   swift_no='swift_1234', correspondent_account='cor_1234')

        admin_user.plant_name = 'plant'
        admin_user.save()
        apiclient.force_login(admin_user)
        response = apiclient.get(reverse('api:v1:banks-list'))

        assert response.status_code == 200, response.json()
        payload = response.json()
        assert len(payload) == 2

        assert payload[0]['name'] == 'bank_name'
        assert payload[0]['code'] == '123'
        assert payload[0]['tin'] == '1234'
        assert payload[0]['address'] == 'address'
        assert payload[0]['city'] == 'city'
        assert payload[0]['swift_no'] == 'swift_123'
        assert payload[0]['correspondent_account'] == 'cor_123'

        assert payload[1]['name'] == 'bank_name1'
        assert payload[1]['code'] == '321'
        assert payload[1]['tin'] == '4321'
        assert payload[1]['address'] == 'address1'
        assert payload[1]['city'] == 'city1'
        assert payload[1]['swift_no'] == 'swift_1234'
        assert payload[1]['correspondent_account'] == 'cor_1234'

    def test_contract_list_filter_by_contract_no(self, apiclient, admin_user, sales_manager):

        TradeAgreement.objects.create(plant_name='plant', sales_manager=sales_manager, due_date=timezone.now(),
                                      type=BaseContract.Type.TRADE, contract_no='123')

        TradeAgreement.objects.create(plant_name='plant', sales_manager=sales_manager, due_date=timezone.now(),
                                      type=BaseContract.Type.TRADE, contract_no='12')

        admin_user.plant_name = 'plant'
        admin_user.save()
        apiclient.force_login(admin_user)
        response = apiclient.get(reverse('api:v1:contracts-list') + '?contract_no=123')

        assert response.status_code == 200
        assert len(response.json()) == 1
        assert response.json()[0]['contract_no'] == '123'

    def test_contract_list_filter_status(self, apiclient, admin_user, sales_manager):

        TradeAgreement.objects.create(plant_name='plant', sales_manager=sales_manager, due_date=timezone.now(),
                                      type=BaseContract.Type.TRADE, contract_no='123',
                                      status=BaseContract.Status.IN_PROCESS)

        TradeAgreement.objects.create(plant_name='plant', sales_manager=sales_manager, due_date=timezone.now(),
                                      type=BaseContract.Type.TRADE, contract_no='12',
                                      status=BaseContract.Status.APPROVED)

        admin_user.plant_name = 'plant'
        admin_user.save()
        apiclient.force_login(admin_user)
        response = apiclient.get(reverse('api:v1:contracts-list') + f'?status={BaseContract.Status.APPROVED}')

        assert response.status_code == 200
        assert len(response.json()) == 1
        assert response.json()[0]['status'] == 'Approved'

    def test_contract_list_filter_by_type(self, apiclient, admin_user, sales_manager):

        TradeAgreement.objects.create(plant_name='plant', sales_manager=sales_manager, due_date=timezone.now(),
                                      type=BaseContract.Type.TRADE, contract_no='123')

        ServiceAgreement.objects.create(plant_name='plant', sales_manager=sales_manager, due_date=timezone.now(),
                                        type=BaseContract.Type.SERVICE, contract_no='12')

        admin_user.plant_name = 'plant'
        admin_user.save()
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

        admin_user.plant_name = 'plant'
        admin_user.save()
        apiclient.force_login(admin_user)
        response = apiclient.get(reverse('api:v1:contracts-list') + f'?sales_manager={sales_manager.id}')

        assert response.status_code == 200
        assert len(response.json()) == 1
        assert response.json()[0]['sales_manager'] == 'First Last' #fullname

    def test_contract_list_filter_by_company_name(self, apiclient, admin_user, sales_manager):

        company = Company.objects.create(type=Company.MMC, name='company_name', address='company_address', tin='12345')

        TradeAgreement.objects.create(plant_name='plant', sales_manager=sales_manager, due_date=timezone.now(),
                                      type=BaseContract.Type.TRADE, contract_no='123', company=company)

        ServiceAgreement.objects.create(plant_name='plant', sales_manager=sales_manager, due_date=timezone.now(),
                                        type=BaseContract.Type.SERVICE, contract_no='12')

        admin_user.plant_name = 'plant'
        admin_user.save()
        apiclient.force_login(admin_user)
        response = apiclient.get(reverse('api:v1:contracts-list') + '?company_name=company_name')

        assert response.status_code == 200, response.json()
        assert len(response.json()) == 1
        assert response.json()[0]['company_name'] == 'company_name'


class TestSalesMangerApiView:

    def test_sales_list_ok(self, apiclient, admin_user, sales_manager):

        sales_manager1 = Person.objects.create(
            type=Person.TYPE.SALES_MANAGER,
            first_name='First1',
            last_name='Last1',
            fathers_name='Father1'
        )

        admin_user.plant_name = 'plant'
        admin_user.save()
        apiclient.force_login(admin_user)
        response = apiclient.get(reverse('api:v1:sales-managers'))

        assert response.status_code == 200, response.json()
        assert len(response.json()) == 2
        payload = response.json()

        assert payload[0]['id'] == sales_manager.id
        assert payload[0]['fullname'] == sales_manager.fullname

        assert payload[1]['id'] == sales_manager1.id
        assert payload[1]['fullname'] == sales_manager1.fullname
