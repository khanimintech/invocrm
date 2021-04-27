import functools

from django.db import models
from django.utils import timezone
from django.utils.translation import gettext as _



CONTRACTS = []


class Contact(models.Model):

    mobile = models.CharField(max_length=50, null=True, blank=True)
    position = models.CharField(max_length=50, null=True, blank=True)
    address = models.CharField(max_length=50, null=True, blank=True)
    work_email = models.CharField(max_length=50, null=True, blank=True)
    personal_email = models.CharField(max_length=50, null=True, blank=True)


class Person(models.Model):
    first_name = models.CharField(max_length=256)
    last_name = models.CharField(max_length=256)
    fathers_name = models.CharField(max_length=256)
    contact = models.OneToOneField(Contact, on_delete=models.CASCADE, null=True)


class AgreementEntity(models.Model):
    MMC = 1
    ASC = 2
    QSC = 3
    INDIVIDUAL = 4

    _TYPE_CHOICES = {
        MMC: _('MMC'),
        ASC: _('ASC'),
        QSC: _('QSC'),
        INDIVIDUAL: _('Individual'),  # one person
    }
    type = models.CharField(choices=tuple(_TYPE_CHOICES.items()), max_length=256)

    # better verbose?
    name = models.CharField(max_length=256, verbose_name=_('Company') + '/' + _('Invidiual') + _('name'))
    tin = models.CharField(max_length=128, verbose_name=_('Taxpayer identification number'))
    address = models.CharField(max_length=512)  # corporate


class Bank(models.Model):
    name = models.CharField(max_length=256)
    code = models.CharField(max_length=256)
    tin = models.CharField(max_length=256, verbose_name=_('TIN'))


class BankAccount(models.Model):
    owner = models.ForeignKey('AgreementEntity', on_delete=models.CASCADE)
    default = models.BooleanField(default=False, verbose_name=_('Is primary account?'))

    account = models.CharField(max_length=256)
    bank = models.ForeignKey('Bank', on_delete=models.CASCADE)

    swift_no = models.CharField(max_length=256)
    correspondent_account = models.CharField(max_length=256)


class BaseContract(models.Model):
    class Status:
        IN_PROCESS, APPROVED, EXPIRED = range(1, 3)

        CHOICES = (
            (IN_PROCESS, _('In process')),
            (APPROVED, _('Approved')),
            (EXPIRED, _('Expired')),
        )

    class Type:
        TRADE, SERVICE, DISTRIBUTION, AGENT, RENT, ONE_TIME, PO = range(1, 8)

        CHOICES = (
            (TRADE, _('Trade')),
            (SERVICE, _('Service')),
            (DISTRIBUTION, _('Distribution')),
            (AGENT, _('Agent')),
            (RENT, _('Rent')),
            (ONE_TIME, _('One-time')),
            (PO, _('Purchase order')),
        )

    AG_TYPE = None  # subclass should define one of the BaseContract.Type

    contract_no = models.CharField(max_length=256)
    entity = models.ForeignKey('api.AgreementEntity')
    type = models.CharField(choices=Type.CHOICES, max_length=40)
    created = models.DateTimeField(default=timezone.now)
    due_date = models.DateTimeField()
    status = models.CharField(choices=Status.CHOICES, max_length=40)
    sales_manager = models.ForeignKey('Person', on_delete=models.CASCADE)

    # TODO maybe entity's ceo - if company type
    executive = models.ForeignKey('Person', on_delete=models.CASCADE)

    def _is_individual_contract(self):
        if isinstance(self, AgentAgreement):
            return True

    def save(self, **kwargs):

        if issubclass(type(self), BaseContract):
            self.type = self.AG_TYPE[0]
            if self._is_individual_contract():
                self.entity.type = AgreementEntity.INDIVIDUAL

        super(BaseContract, self).save(**kwargs)


class TradeAgreement(BaseContract):
    AG_TYPE = BaseContract.Type.TRADE


class ServiceAgreement(BaseContract):
    AG_TYPE = BaseContract.Type.SERVICE


class DistributionAgreement(BaseContract):
    AG_TYPE = BaseContract.Type.DISTRIBUTION
    # TODO CountryField() waiting to approve or delete
    territory = models.CharField(max_length=256, verbose_name=_('Applied territory'))
    subject_of_distribution = models.CharField(max_length=256, verbose_name=_('Subject of distribtion'))


class AgentAgreement(BaseContract):
    territory = models.CharField(max_length=256, verbose_name=_('Applied territory'))


class POAgreement(BaseContract):  # PurchaseOrderAgreement
    AG_TYPE = BaseContract.Type.PO
    # contract no - for now.
    po_number = models.CharField(max_length=256, verbose_name=_('Purchase order number'))


class RentAgreement(BaseContract):
    AG_TYPE = BaseContract.Type.RENT


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



