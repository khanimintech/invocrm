from django.contrib import admin


from api.main_models.annex import UnitOfMeasure
from api.main_models.contract import TradeAgreement, BaseContract, Contact, Bank, BankAccount, Company
from api.models import CustomUser, Person

admin.site.register(CustomUser)
admin.site.register(Person)
admin.site.register(TradeAgreement)
admin.site.register(BaseContract)
admin.site.register(Contact)
admin.site.register(Bank)
admin.site.register(BankAccount)
admin.site.register(Company)

admin.site.register(UnitOfMeasure)
