from django.utils import timezone

from rest_framework.reverse import reverse
from api.main_models.contract import BaseContract, TradeAgreement, Company, Bank, BankAccount, ServiceAgreement


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
                                      type=BaseContract.Type.TRADE)

        admin_user.plant_name = 'plant'
        admin_user.save()
        apiclient.force_login(admin_user)
        response = apiclient.get(reverse('api:v1:contract-list'))

        assert response.status_code == 200

    # def test_trade_create(self, apiclient, admin_user, sales_manager):
    #
    #     admin_user.plant_name = 'plant'
    #     admin_user.save()
    #     apiclient.force_login(admin_user)
    #     response = apiclient.post(reverse('api:v1:contract-list'),
    #                               data={
    #                                   'contract_no': 123,
    #                                   'type': BaseContract.Type.TRADE,
    #                                   'sales_manager': sales_manager.id,
    #                                   'due_date': timezone.now(),
    #                                   'entity': {
    #                                       'name': 'My_company',
    #                                       'type': Company.MMC,
    #                                       'tin': '1234567890',
    #                                       'address': 'My_address'
    #                                   },
    #                                   'executive': {
    #                                       'first_name': 'First',
    #                                       'last_name': 'Last',
    #                                       'fathers_name': 'Father',
    #                                   },
    #                                   'responsible_person': {
    #                                       'first_name': 'First',
    #                                       'last_name': 'Last',
    #                                       'fathers_name': 'Father',
    #                                   },
    #                                   'contact': {
    #                                       'mobile': '1234567890',
    #                                       'position': 'My_position',
    #                                       'address': 'My_address',
    #                                       'work_email': 'My_work_email@email.fake',
    #                                       'personal_email': 'My_personal_email@email.fake'
    #
    #                                   },
    #                                   'bank': {
    #                                       'name': 'My_bank',
    #                                       'code': '1234567890',
    #                                       'tin': '1234567890'
    #                                   },
    #                                   'bank_account': {
    #                                       'default': True,
    #                                       'account': 'My_account',
    #                                       'swift_no': '1234567890',
    #                                       'correspondent_account': 'My_correspondent_account'
    #                                   }
    #
    #                               },
    #                               format='json'
    #                               )
    #
    #     assert response.status_code == 201
    #
    #     assert TradeAgreement.objects.all().count() == 1
    #
    #     trade_agr = TradeAgreement.objects.first()
    #
    #     assert trade_agr.contract_no == '123'
    #     assert trade_agr.sales_manager.id == sales_manager.id
    #
    #     entity = trade_agr.entity
    #
    #     assert entity.name == 'My_company'
    #     assert entity.type == Company.MMC
    #     assert entity.tin == '1234567890'
    #     assert entity.address == 'My_address'
    #
    #     executive = trade_agr.executive
    #
    #     assert executive.first_name == 'First'
    #     assert executive.last_name == 'Last'
    #     assert executive.fathers_name == 'Father'
    #
    #     responsible_person = trade_agr.responsible_person
    #
    #     assert responsible_person.first_name == 'First'
    #     assert responsible_person.last_name == 'Last'
    #     assert responsible_person.fathers_name == 'Father'
    #
    #     contact = responsible_person.contact
    #
    #     assert contact.mobile == '1234567890'
    #     assert contact.position == 'My_position'
    #     assert contact.address == 'My_address'
    #     assert contact.work_email == 'My_work_email@email.fake'
    #     assert contact.personal_email == 'My_personal_email@email.fake'
    #
    #     assert BankAccount.objects.filter(owner=entity).count() == 1
    #
    #     bank_acc = BankAccount.objects.filter(owner=entity).first()
    #
    #     assert bank_acc.default is True
    #     assert bank_acc.account == 'My_account'
    #     assert bank_acc.swift_no == '1234567890'
    #     assert bank_acc.correspondent_account == 'My_correspondent_account'
    #
    #     bank = bank_acc.bank
    #
    #     assert bank.name == 'My_bank'
    #     assert bank.code == '1234567890'
    #     assert bank.tin == '1234567890'
    #
    # def test_service_create(self, apiclient, admin_user, sales_manager):
    #
    #     admin_user.plant_name = 'plant'
    #     admin_user.save()
    #     apiclient.force_login(admin_user)
    #     response = apiclient.post(reverse('api:v1:service-create'),
    #                               data={
    #                                   'contract_no': 123,
    #                                   'type': BaseContract.Type.SERVICE,
    #                                   'sales_manager': sales_manager.id,
    #                                   'due_date': timezone.now(),
    #                                   'entity': {
    #                                       'name': 'My_company',
    #                                       'type': Company.MMC,
    #                                       'tin': '1234567890',
    #                                       'address': 'My_address'
    #                                   },
    #                                   'executive': {
    #                                       'first_name': 'First',
    #                                       'last_name': 'Last',
    #                                       'fathers_name': 'Father',
    #                                   },
    #                                   'responsible_person': {
    #                                       'first_name': 'First',
    #                                       'last_name': 'Last',
    #                                       'fathers_name': 'Father',
    #                                   },
    #                                   'contact': {
    #                                       'mobile': '1234567890',
    #                                       'position': 'My_position',
    #                                       'address': 'My_address',
    #                                       'work_email': 'My_work_email@email.fake',
    #                                       'personal_email': 'My_personal_email@email.fake'
    #
    #                                   },
    #                                   'bank': {
    #                                       'name': 'My_bank',
    #                                       'code': '1234567890',
    #                                       'tin': '1234567890'
    #                                   },
    #                                   'bank_account': {
    #                                       'default': True,
    #                                       'account': 'My_account',
    #                                       'swift_no': '1234567890',
    #                                       'correspondent_account': 'My_correspondent_account'
    #                                   }
    #
    #                               },
    #                               format='json'
    #                               )
    #
    #     assert response.status_code == 201
    #
    #     assert ServiceAgreement.objects.all().count() == 1
    #
    #     trade_agr = TradeAgreement.objects.first()
    #
    #     assert trade_agr.contract_no == '123'
    #     assert trade_agr.sales_manager.id == sales_manager.id
    #
    #     entity = trade_agr.entity
    #
    #     assert entity.name == 'My_company'
    #     assert entity.type == Company.MMC
    #     assert entity.tin == '1234567890'
    #     assert entity.address == 'My_address'
    #
    #     executive = trade_agr.executive
    #
    #     assert executive.first_name == 'First'
    #     assert executive.last_name == 'Last'
    #     assert executive.fathers_name == 'Father'
    #
    #     responsible_person = trade_agr.responsible_person
    #
    #     assert responsible_person.first_name == 'First'
    #     assert responsible_person.last_name == 'Last'
    #     assert responsible_person.fathers_name == 'Father'
    #
    #     contact = responsible_person.contact
    #
    #     assert contact.mobile == '1234567890'
    #     assert contact.position == 'My_position'
    #     assert contact.address == 'My_address'
    #     assert contact.work_email == 'My_work_email@email.fake'
    #     assert contact.personal_email == 'My_personal_email@email.fake'
    #
    #     assert BankAccount.objects.filter(owner=entity).count() == 1
    #
    #     bank_acc = BankAccount.objects.filter(owner=entity).first()
    #
    #     assert bank_acc.default is True
    #     assert bank_acc.account == 'My_account'
    #     assert bank_acc.swift_no == '1234567890'
    #     assert bank_acc.correspondent_account == 'My_correspondent_account'
    #
    #     bank = bank_acc.bank
    #
    #     assert bank.name == 'My_bank'
    #     assert bank.code == '1234567890'
    #     assert bank.tin == '1234567890'
    #
    # def test_cwwwontr(self, apiclient, admin_user, sales_manager):
    #
    #     admin_user.plant_name = 'plant'
    #     admin_user.save()
    #     apiclient.force_login(admin_user)
    #     response = apiclient.post(reverse('api:v1:contr-list'),
    #                               data={
    #                                   'contract_no': 123,
    #                                   'type': BaseContract.Type.SERVICE,
    #                                   'sales_manager': sales_manager.id,
    #                                   'due_date': timezone.now(),
    #                                   'entity': {
    #                                       'name': 'My_company',
    #                                       'type': Company.MMC,
    #                                       'tin': '1234567890',
    #                                       'address': 'My_address'
    #                                   },
    #                                   'executive': {
    #                                       'first_name': 'First',
    #                                       'last_name': 'Last',
    #                                       'fathers_name': 'Father',
    #                                   },
    #                                   'responsible_person': {
    #                                       'first_name': 'First',
    #                                       'last_name': 'Last',
    #                                       'fathers_name': 'Father',
    #                                   },
    #                                   'contact': {
    #                                       'mobile': '1234567890',
    #                                       'position': 'My_position',
    #                                       'address': 'My_address',
    #                                       'work_email': 'My_work_email@email.fake',
    #                                       'personal_email': 'My_personal_email@email.fake'
    #
    #                                   },
    #                                   'bank': {
    #                                       'name': 'My_bank',
    #                                       'code': '1234567890',
    #                                       'tin': '1234567890'
    #                                   },
    #                                   'bank_account': {
    #                                       'default': True,
    #                                       'account': 'My_account',
    #                                       'swift_no': '1234567890',
    #                                       'correspondent_account': 'My_correspondent_account'
    #                                   }
    #
    #                               },
    #                               format='json'
    #                               )
    #
    #     assert response.status_code == 201
