from django.db import models
from django.utils import timezone
from django.utils.translation import gettext as _


class BaseContract(models.Model):

    class Status:

        IN_PROCESS, APPROVED, EXPIRED = range(0, 3) # expires after 2 weeks status - processing on view

        CHOICES = (
            (IN_PROCESS, _('In process')),
            (APPROVED, _('Approved')),
            (EXPIRED, _('Expired')),
        )

    class Type:

        TRADE, SERVICE, DISTRIBUTION, AGENT, RENT, ONE_TIME, PO, INTERNATIONAL, CUSTOMER = range(1, 10)

        CHOICES = (
            (TRADE, _('Trade')),
            (SERVICE, _('Service')),
            (DISTRIBUTION, _('Distribution')),
            (AGENT, _('Agent')),
            (RENT, _('Rent')),
            (ONE_TIME, _('One-time')),
            (PO, _('Purchase order')),
            (INTERNATIONAL, _('International')),
            (CUSTOMER, _('Customer')),
        )

    AG_TYPE = None  # subclass should define one of the BaseContract.Type

    plant_name = models.CharField(max_length=256, default=None)

    contract_no = models.CharField(max_length=256, null=True, blank=True)
    company = models.ForeignKey('api.Company', on_delete=models.CASCADE, null=True, blank=True)
    type = models.SmallIntegerField(choices=Type.CHOICES)
    created = models.DateTimeField(default=timezone.now)
    due_date = models.DateTimeField()
    status = models.SmallIntegerField(choices=Status.CHOICES, default=Status.IN_PROCESS)
    sales_manager = models.ForeignKey('Person', on_delete=models.CASCADE, related_name='contracts',
                                      null=True, blank=True)
    executor = models.OneToOneField('Person', on_delete=models.CASCADE, related_name='my_contracts',
                                    null=True, blank=True)

    responsible_person = models.OneToOneField('Person', on_delete=models.CASCADE, related_name='agreements',
                                              null=True, blank=True)

    def _is_individual_contract(self):
        if not hasattr(self, 'company'):
            return True

    def save(self, **kwargs):

        if issubclass(type(self), BaseContract):
            self.type = self.AG_TYPE

        super(BaseContract, self).save(**kwargs)


class TradeAgreement(BaseContract):
    AG_TYPE = BaseContract.Type.TRADE


class ServiceAgreement(BaseContract):
    AG_TYPE = BaseContract.Type.SERVICE


class DistributionAgreement(BaseContract):
    AG_TYPE = BaseContract.Type.DISTRIBUTION
    # TODO CountryField() waiting to approve or delete
    territory = models.CharField(max_length=256, verbose_name=_('Applied territory'))
    subject_of_distribution = models.CharField(max_length=256, verbose_name=_('Subject of distribution'))


class AgentAgreement(BaseContract):
    AG_TYPE = BaseContract.Type.AGENT
    territory = models.CharField(max_length=256, verbose_name=_('Applied territory'))


class POAgreement(BaseContract):  # PurchaseOrderAgreement
    AG_TYPE = BaseContract.Type.PO
    # contract no - for now.
    po_number = models.CharField(max_length=256, verbose_name=_('Purchase order number'))


class RentAgreement(BaseContract):
    AG_TYPE = BaseContract.Type.RENT


class OneTimeAgreement(BaseContract):

    AG_TYPE = BaseContract.Type.ONE_TIME

    final_amount_with_writing = models.TextField()
    price_offer = models.TextField()
    price_offer_validity = models.TextField()
    warranty_period = models.TextField()
    unpaid_period = models.TextField()
    unpaid_value = models.TextField()
    part_payment = models.TextField()
    part_acquisition = models.TextField()
    standard = models.TextField()


class InternationalAgreement(BaseContract):

    AG_TYPE = BaseContract.Type.INTERNATIONAL
    country = models.CharField(max_length=256, null=True, blank=True)
    payment_condition = models.CharField(max_length=256, null=True, blank=True)


class CustomerTemplateAgreement(BaseContract):

    class CustomerType:

        TRADE, SERVICE, DISTRIBUTION, AGENT = range(1, 5)

        CHOICES = (
            (TRADE, _('Trade')),
            (SERVICE, _('Service')),
            (DISTRIBUTION, _('Distribution')),
            (AGENT, _('Agent')),
        )

    AG_TYPE = BaseContract.Type.CUSTOMER
    custom_contract_type = models.SmallIntegerField(choices=CustomerType.CHOICES)


class Contact(models.Model):

    mobile = models.CharField(max_length=50, null=True, blank=True)
    address = models.CharField(max_length=50, null=True, blank=True)
    work_email = models.CharField(max_length=50, null=True, blank=True)
    personal_email = models.CharField(max_length=50, null=True, blank=True)


class Company(models.Model):

    MMC = 1
    ASC = 2
    QSC = 3

    _TYPE_CHOICES = {
        MMC: _('MMC'),
        ASC: _('ASC'),
        QSC: _('QSC'),
    }
    type = models.SmallIntegerField(choices=tuple(_TYPE_CHOICES.items()))

    name = models.CharField(max_length=256, verbose_name=_('Company'))
    address = models.CharField(max_length=512)
    tin = models.CharField(max_length=128, verbose_name=_('Taxpayer identification number'))


class Bank(models.Model):

    name = models.CharField(max_length=256)
    code = models.CharField(max_length=256)
    tin = models.CharField(max_length=256, verbose_name=_('TIN'))


class BankAccount(models.Model):

    owner = models.ForeignKey('Company', on_delete=models.CASCADE)
    default = models.BooleanField(default=False, verbose_name=_('Is primary account?'))

    account = models.CharField(max_length=256)
    bank = models.ForeignKey('Bank', on_delete=models.CASCADE)

    swift_no = models.CharField(max_length=256)
    correspondent_account = models.CharField(max_length=256)
