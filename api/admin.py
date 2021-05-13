from django.contrib import admin
from api.models import CustomUser, Person
from api.main_models.contract import TradeAgreement

admin.site.register(CustomUser)
admin.site.register(Person)
admin.site.register(TradeAgreement)