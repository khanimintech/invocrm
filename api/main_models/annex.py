from django.db import models
from django.utils import timezone
from api.main_models.contract import BaseContract
from api.main_models.managers import AnnexQuerySet
from api.models import Person
from django.utils.translation import gettext as _

# This is fake pseudo annex just to store supplement for now,
# because subject to change, will be added PO suppl file itself here, probably
class POAgreementSupplements(models.Model):
    agreement = models.ForeignKey('POAgreement', on_delete=models.CASCADE, related_name='supplements')
    supplement_no = models.CharField(max_length=64,)


class BaseAnnex(models.Model):

    class Status:

        IN_PROCESS, APPROVED, CANCELED = range(0, 3)

        CHOICES = (
            (IN_PROCESS, _('In process')),
            (APPROVED, _('Approved')),
            (CANCELED, _('Canceled')),
        )

    objects = AnnexQuerySet.as_manager()

    contract = models.ForeignKey(BaseContract, on_delete=models.CASCADE, related_name='annex_list')

    annex_no = models.IntegerField(default=0)
    request_no = models.CharField(max_length=256, null=True, blank=True)

    annex_date = models.DateTimeField(null=True, blank=True, default=timezone.now)
    note = models.TextField(null=True, blank=True)
    # extra_note =  TODO check Gunay if we can use note field above for all added notes.
    payment_terms = models.TextField(null=True, blank=True)
    delivery_terms = models.TextField(null=True, blank=True)
    acquisition_terms = models.TextField(null=True, blank=True)
    created = models.DateTimeField(default=timezone.now)

    seller = models.ForeignKey(Person, on_delete=models.CASCADE, related_name='seller_annex_list', null=True, blank=True)
    sales_manager = models.ForeignKey(Person, on_delete=models.CASCADE, related_name='sales_manager_annex_list', null=True, blank=True)

    with_vat = models.BooleanField(default=False)

    total = models.FloatField(null=True, blank=True)

    status = models.SmallIntegerField(choices=Status.CHOICES, default=Status.IN_PROCESS)

    revision_count = models.IntegerField(default=0)


class UnitOfMeasure(models.Model):
    name = models.CharField(max_length=40)


class ProductInvoiceItem(models.Model):

    name = models.CharField(max_length=400)

    annex = models.ForeignKey(BaseAnnex, on_delete=models.CASCADE, related_name='products')

    unit = models.ForeignKey('UnitOfMeasure', on_delete=models.CASCADE)
    quantity = models.IntegerField()
    price = models.FloatField()  # single
    total = models.FloatField()  # mostly read-only. needed for simplified SQL


class AgentInvoiceItem(models.Model):

    annex = models.ForeignKey(BaseAnnex, on_delete=models.CASCADE, related_name='agent_items', null=True, blank=True)

    client_name = models.CharField(max_length=256)
    invoice_no = models.CharField(max_length=256)
    date = models.DateField(default=timezone.now)
    annex_no = models.IntegerField(default=1)
    paids_from_customer = models.IntegerField(null=True, blank=True)
    agent_reward = models.IntegerField(null=True, blank=True)


class RentConditions(models.Model):

    annex = models.ForeignKey(BaseAnnex, on_delete=models.CASCADE, related_name='rent_conditions')
    name = models.TextField()


class RentItems(models.Model):

    annex = models.ForeignKey(BaseAnnex, on_delete=models.CASCADE, related_name='rent_items')
    unit = models.ForeignKey('UnitOfMeasure', on_delete=models.CASCADE)

    item_name = models.CharField(max_length=256)
    term = models.IntegerField()
    quantity = models.IntegerField()
    one_day_rent = models.IntegerField()
    total = models.FloatField()

