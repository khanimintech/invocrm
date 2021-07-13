from django.db import models
from django.utils import timezone
from django.utils.translation import gettext as _


class BaseContract(models.Model):

    class Status:

        # expires after 2 weeks status(3) - processing on view
        IN_PROCESS = 0
        APPROVED = 1
        EXPIRED = 2
        CANCELED = 4

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
    due_date = models.DateTimeField(null=True, blank=True)
    status = models.SmallIntegerField(choices=Status.CHOICES, default=Status.IN_PROCESS)
    sales_manager = models.ForeignKey('Person', on_delete=models.CASCADE, related_name='contracts',
                                      null=True, blank=True)
    executor = models.OneToOneField('Person', on_delete=models.CASCADE, related_name='contract',
                                    null=True, blank=True)

    responsible_person = models.OneToOneField('Person', on_delete=models.CASCADE, related_name='agreement',
                                              null=True, blank=True)

    @property
    def _is_individual_contract(self):

        if not self.company:
            return True
        else:
            return False

    def __str__(self):

        return self.get_type_display() + ' ' + str(self.contract_no)

    def save(self, **kwargs):

        if issubclass(type(self), BaseContract) and self.pk is None:
            self.type = self.AG_TYPE

            if self.AG_TYPE == BaseContract.Type.PO:
                self.contract_no = self.po_number

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

    final_amount_with_writing = models.TextField(null=True, blank=True)
    price_offer = models.TextField(null=True, blank=True)
    price_offer_validity = models.TextField(null=True, blank=True)
    warranty_period = models.TextField(null=True, blank=True)
    unpaid_period = models.TextField(null=True, blank=True)
    unpaid_value = models.TextField(null=True, blank=True)
    part_payment = models.TextField(null=True, blank=True)
    part_acquisition = models.TextField(null=True, blank=True)
    standard = models.TextField(null=True, blank=True)


class InternationalAgreement(BaseContract):

    AG_TYPE = BaseContract.Type.INTERNATIONAL
    country = models.CharField(max_length=256, null=True, blank=True)
    payment_condition = models.CharField(max_length=256, null=True, blank=True)


class CustomerTemplateAgreement(BaseContract):

    class CustomerType:

        TRADE, SERVICE, DISTRIBUTION, AGENT, RENT, ONE_TIME, INTERNATIONAL = range(1, 8)

        CHOICES = (
            (TRADE, _('Trade')),
            (SERVICE, _('Service')),
            (DISTRIBUTION, _('Distribution')),
            (AGENT, _('Agent')),
        )

    AG_TYPE = BaseContract.Type.CUSTOMER
    custom_contract_type = models.SmallIntegerField(choices=CustomerType.CHOICES)


class Contact(models.Model):

    mobile = models.CharField(max_length=256, null=True, blank=True)
    address = models.CharField(max_length=512, null=True, blank=True)
    work_email = models.CharField(max_length=256, null=True, blank=True)
    personal_email = models.CharField(max_length=256, null=True, blank=True)
    web_site = models.CharField(max_length=256, null=True, blank=True)
    plant_name = models.CharField(max_length=256, null=True, blank=True)
    company_name = models.CharField(max_length=256, null=True, blank=True) # for custom create
    custom = models.BooleanField(default=False)


class Company(models.Model):

    MMC = 1
    ASC = 2
    QSC = 3

    _TYPE_CHOICES = {
        MMC: _('MMC'),
        ASC: _('ASC'),
        QSC: _('QSC'),
    }
    type = models.SmallIntegerField(choices=tuple(_TYPE_CHOICES.items()), null=True, blank=True)

    name = models.CharField(max_length=256, verbose_name=_('Company'))
    address = models.CharField(max_length=512, null=True, blank=True)
    tin = models.CharField(max_length=128, verbose_name=_('Taxpayer identification number'), null=True, blank=True)
    email = models.CharField(max_length=50, null=True, blank=True)


class Bank(models.Model):

    name = models.CharField(max_length=256)
    code = models.CharField(max_length=256)
    tin = models.CharField(max_length=256, verbose_name=_('TIN'), null=True)


class BankAccount(models.Model):

    company_owner = models.ForeignKey('Company', on_delete=models.CASCADE, null=True, blank=True, related_name='bank_acc_list')
    personal_owner = models.ForeignKey('Person', on_delete=models.CASCADE, null=True, blank=True, related_name='b_acc_list')
    default = models.BooleanField(default=False, verbose_name=_('Is primary account?'))

    account = models.CharField(max_length=256)
    bank = models.ForeignKey('Bank', on_delete=models.CASCADE)
    address = models.CharField(max_length=256, null=True, blank=True)
    city = models.CharField(max_length=256, null=True, blank=True)
    swift_no = models.CharField(max_length=256)
    correspondent_account = models.CharField(max_length=256)
