from django.db import models
from django.utils import timezone
from api.main_models.contract import BaseContract
from django.utils.translation import gettext as _


# This is fake pseudo annex just to store supplement for now,
# because subject to change, will be added PO suppl file itself here, probably

class POAgreementAnnex(BaseContract):
    agreement = models.ForeignKey('POAgreement', on_delete=models.CASCADE)
    supplement_no = models.CharField(max_length=64,)


class TradeAgreementAnnex(models.Model):

    request_no = models.CharField(max_length=256, unique=True)
    annex_date = models.DateTimeField()
    note = models.TextField()
    # extra_note =  TODO check Gunay if we can use note field above for all added notes.
    payment_terms = models.TextField()
    delivery_terms = models.TextField()
    acquisition_terms = models.TextField()
    created = models.DateTimeField(default=timezone.now)

    @property
    def annex_total_price(self):  # TODO fix
        """
        Returns last revision product's (total, total_with_vat) tuple
        :return:
        """
        total = 0
        for product in self.current_revision.products.all():
            total += product.product_quantity * product.unit_price
        return total, round(total + (total * 18 / 100), 3)


class UnitOfMeasure(models.Model):
    name = models.CharField(max_length=40)


class ProductInvoiceItem(models.Model):

    name = models.CharField(max_length=400)
    unit = models.ForeignKey('UnitOfMeasure', on_delete=models.CASCADE)
    quantity = models.IntegerField()
    price = models.IntegerField()  # single
    total = models.IntegerField()  # mostly read-only. needed for simplified SQL


class AgentInvoiceItem(models.Model):

    client_name = models.CharField(max_length=256)
    invoice_no = models.CharField(max_length=256)
    date = models.DateField(default=timezone.now)
    annex_no = models.IntegerField(default=timezone.now)
