from django.contrib import admin

from api.main_models.annex import UnitOfMeasure
from api.models import CustomUser, Person
from api.main_models.contract import TradeAgreement

admin.site.register(CustomUser)
admin.site.register(Person)
admin.site.register(TradeAgreement)
admin.site.register(UnitOfMeasure)
