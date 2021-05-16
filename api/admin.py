from django.contrib import admin

from api.main_models.annex import UnitOfMeasure
from api.models import CustomUser, Person

admin.site.register(CustomUser)
admin.site.register(Person)
admin.site.register(UnitOfMeasure)
