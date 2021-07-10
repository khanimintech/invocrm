from django.db import models
from django.utils import timezone

from api.main_models.contract import BaseContract


class ContractAttachment(models.Model):
    contract = models.ForeignKey(BaseContract, on_delete=models.CASCADE, related_name='attachments')
    attachment = models.FileField()
    created = models.DateTimeField(default=timezone.now)


# TODO for now related to contract, should be discussed and mapped to annex afterwards
class AnnexAttachment(models.Model):

    # will be : annex?
    contract = models.ForeignKey(BaseContract, on_delete=models.CASCADE, related_name='annex_attachments')
    attachment = models.FileField()
    created = models.DateTimeField(default=timezone.now)


class OtherAttachment(models.Model):
    contract = models.ForeignKey(BaseContract, on_delete=models.CASCADE, related_name='other_attachments')
    attachment = models.FileField()
    created = models.DateTimeField(default=timezone.now)
