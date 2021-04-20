from django.contrib.auth.models import User
from django.db import models
from django.utils import timezone


class CustomUser(User):
    plant_name = models.CharField(max_length=100)

    def __str__(self):
        return f'{self.plant_name} / {self.username}'


class Buyer(models.Model):

    name = models.CharField(max_length=100)
    surname = models.CharField(max_length=100)
    position = models.CharField(max_length=255)


class SalesManager(models.Model):

    name = models.CharField(max_length=100)
    surname = models.CharField(max_length=100)
    position = models.CharField(max_length=255)


class Condition(models.Model):

    payment = models.CharField(max_length=255)
    delivery = models.CharField(max_length=255)
    handed = models.CharField(max_length=255)
    custom_condition = models.CharField(max_length=255)


class Plant(models.Model):

    name = models.CharField(max_length=100)


class Annex(models.Model):

    contract = models.ForeignKey('Contract', on_delete=models.PROTECT,
                                 null=True, blank=True, related_name='annex_list')

    buyer = models.OneToOneField(Buyer, on_delete=models.CASCADE, default=None)
    sales_manager = models.OneToOneField(SalesManager, on_delete=models.CASCADE, default=None)

    plant = models.OneToOneField(Plant, on_delete=models.CASCADE, default=None)

    current_revision = models.OneToOneField('AnnexRevision', on_delete=models.PROTECT, null=True, blank=True,
                                            related_name='current_annex')

    inquery = models.CharField(max_length=100)
    annex_num = models.PositiveIntegerField(default=1)
    created = models.DateTimeField(default=timezone.now)


class AnnexRevision(models.Model):

    annex = models.ForeignKey(Annex, on_delete=models.CASCADE, related_name='revisions')
    number = models.IntegerField(default=1)
    created = models.DateTimeField(default=timezone.now)


class Product(models.Model):

    annex_revision = models.ForeignKey(AnnexRevision, on_delete=models.CASCADE,
                                       null=True, blank=True, related_name='products')

    name = models.CharField(max_length=255)

    product_quantity = models.PositiveIntegerField(null=True)
    unit_price = models.PositiveIntegerField()
    total_price = models.PositiveIntegerField()


class Contract(models.Model):

    class STATUS:
        IN_PROGRESS = 0
        APPROVED = 1
        TIME_OVER = 2

        CHOICES = (
            (IN_PROGRESS, 'In progress'),
            (APPROVED, 'Approved'),
            (TIME_OVER, 'Time over')
        )

    class TYPE:

        BUY_SALE = 0
        ONE_TIME = 1
        DISTRIBUTOR = 2
        SERVICE = 3

        CHOICES = (
            (BUY_SALE, 'Buy-sale'),
            (ONE_TIME, 'One time'),
            (DISTRIBUTOR, 'Distributor'),
            (SERVICE, 'Service'),
        )

    creator = models.ForeignKey('CustomUser', on_delete=models.CASCADE, null=True)
    type = models.PositiveSmallIntegerField(
        'Type', choices=TYPE.CHOICES, default=TYPE.BUY_SALE,
    )
    status = models.PositiveSmallIntegerField(
        'Contract status', choices=STATUS.CHOICES, default=STATUS.IN_PROGRESS,
    )

    client = models.OneToOneField('Client', blank=True, null=True, on_delete=models.CASCADE)
    bank = models.OneToOneField('Bank', blank=True, null=True, on_delete=models.CASCADE, )
    entity = models.OneToOneField('Entity', blank=True, null=True,  on_delete=models.CASCADE)


class Entity(models.Model):

    class TYPE:

        # ?? TODO choices
        MMC = 0
        OOO = 1
        INDIVIDUAL = 3

        CHOICES = (
            (MMC, 'MMC'),
            (OOO, 'OOO'),
            (INDIVIDUAL, 'INDIVIDUAL'),
        )

    name = models.CharField(max_length=255)
    legal_address = models.CharField(max_length=255)
    created_date = models.DateField()
    expired_date = models.DateField()
    sales_manager = models.ForeignKey('SalesManager', on_delete=models.CASCADE)
    num = models.PositiveBigIntegerField(unique=True)

    # Director class ?
    director_name = models.CharField(max_length=50)
    director_surname = models.CharField(max_length=50)
    director_middle_name = models.CharField(max_length=50)


class Client(models.Model):

    responsible_person = models.CharField(max_length=50)
    phone_num = models.CharField(max_length=50)
    position = models.CharField(max_length=100)
    address = models.CharField(max_length=255)
    work_email = models.EmailField()
    personal_email = models.EmailField()
    web_site = models.URLField()


class Bank(models.Model):

    account = models.CharField(max_length=255)
    name = models.CharField(max_length=255)
    country = models.CharField(max_length=255)
    city = models.CharField(max_length=255)
    swift = models.PositiveIntegerField()
    banking_code = models.PositiveIntegerField()
    voen = models.PositiveBigIntegerField(unique=True)
    reporter_account = models.CharField(max_length=255)
