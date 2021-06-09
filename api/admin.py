from django.contrib import admin


from api.main_models.annex import UnitOfMeasure
from api.main_models.contract import TradeAgreement, BaseContract, Contact, Bank, BankAccount, Company
from api.models import CustomUser, Person

admin.site.register(CustomUser)
admin.site.register(Person)
admin.site.register(TradeAgreement)


class BaseContractAdmin(admin.ModelAdmin):
    def has_add_permission(self, request, obj=None):
        return False

admin.site.register(BaseContract, BaseContractAdmin)

admin.site.register(Contact)
admin.site.register(Bank)
admin.site.register(BankAccount)
admin.site.register(Company)

admin.site.register(UnitOfMeasure)
