from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils.translation import gettext as _

from api.main_models.contract import Contact


class CustomUser(AbstractUser):
    plant_name = models.CharField(max_length=100)

    def __str__(self):
        return f'{self.plant_name} / {self.username}'


class Person(models.Model):

    class TYPE:

        BUYER, SALES_MANAGER, SELLER, CONTACT = range(0, 4)

        CHOICES = (
            (BUYER, _('Buyer')),
            (SALES_MANAGER, _('Sales manager')),
            (SELLER, _('Seller')),
            (CONTACT, _('Contact')),
        )

    first_name = models.CharField(max_length=256)
    last_name = models.CharField(max_length=256)
    fathers_name = models.CharField(max_length=256)
    position = models.CharField(max_length=50, null=True, blank=True)
    contact = models.OneToOneField(Contact, on_delete=models.CASCADE, null=True)

    type = models.SmallIntegerField(choices=TYPE.CHOICES)

    @property
    def fullname(self):

        return f'{self.first_name}' + ' ' + f'{self.last_name}'
