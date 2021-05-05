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

        TRADE, SERVICE, DISTRIBUTION, AGENT, RENT, ONE_TIME, PO, INTERNATIONAL = range(1, 9)

        CHOICES = (
            (TRADE, _('Trade')),
            (SERVICE, _('Service')),
            (DISTRIBUTION, _('Distribution')),
            (AGENT, _('Agent')),
            (RENT, _('Rent')),
            (ONE_TIME, _('One-time')),
            (PO, _('Purchase order')),
            (INTERNATIONAL, _('International')),
        )

    AG_TYPE = None  # subclass should define one of the BaseContract.Type

    plant_name = models.CharField(max_length=256, default=None)

    contract_no = models.CharField(max_length=256, null=True, blank=True)
    entity = models.ForeignKey('api.AgreementEntity', on_delete=models.CASCADE, null=True, blank=True)
    type = models.CharField(choices=Type.CHOICES, max_length=40)
    created = models.DateTimeField(default=timezone.now)
    due_date = models.DateTimeField()
    status = models.CharField(choices=Status.CHOICES, max_length=40, default=Status.IN_PROCESS)
    sales_manager = models.ForeignKey('Person', on_delete=models.CASCADE, related_name='contracts',
                                      null=True, blank=True)

    # TODO maybe entity's ceo - if company type
    executive = models.ForeignKey('Person', on_delete=models.CASCADE, related_name='my_contracts',
                                  null=True, blank=True)

    def _is_individual_contract(self):
        if isinstance(self, AgentAgreement):
            return True

    # def save(self, **kwargs):
    #
    #     if issubclass(type(self), BaseContract):
    #         self.type = self.Type[0]
    #         if self._is_individual_contract():
    #             self.entity.type = AgreementEntity.INDIVIDUAL
    #
    #     super(BaseContract, self).save(**kwargs)


class TradeAgreement(BaseContract):
    AG_TYPE = BaseContract.Type.TRADE
    responsible_person = models.OneToOneField('Person', on_delete=models.CASCADE, related_name='trade_agreements',
                                              null=True, blank=True)


class ServiceAgreement(BaseContract):
    AG_TYPE = BaseContract.Type.SERVICE
    responsible_person = models.OneToOneField('Person', on_delete=models.CASCADE, related_name='service_agreements',
                                              null=True, blank=True)


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


class InternationalAgreement(BaseContract):

    AG_TYPE = BaseContract.Type.INTERNATIONAL
    country = models.CharField(max_length=256, null=True, blank=True)
    payment_condition = models.CharField(max_length=256, null=True, blank=True)


class Contact(models.Model):

    mobile = models.CharField(max_length=50, null=True, blank=True)
    position = models.CharField(max_length=50, null=True, blank=True)
    address = models.CharField(max_length=50, null=True, blank=True)
    work_email = models.CharField(max_length=50, null=True, blank=True)
    personal_email = models.CharField(max_length=50, null=True, blank=True)


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
    type = models.SmallIntegerField(choices=tuple(_TYPE_CHOICES.items()))

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
