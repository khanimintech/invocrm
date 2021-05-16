from datetime import timedelta

from django.db.models import Q, Count, Min, Max, QuerySet, F, OuterRef, Case, Subquery, Exists, When, \
    BooleanField, Value, IntegerField, CharField, Prefetch, Func, Sum
from django.utils import timezone


class AnnexQuerySet(QuerySet):

    def a_sum_no_invoice(self):
        pass

        from api.main_models.annex import ProductInvoiceItem

        # qs = self.aggregate(
        #     sum_no_invoice=Sum(
        #         ProductInvoiceItem.objects.filter(annex=OuterRef('id')).values['total']
        #     )
        #

        # .aggregate(
        #     sum_with_invoice=Sum('sum_no_invoice', field="sum_no_invoice*18")
        # ) .aggregate(total=Sum('total'))['total']


# class ContractQuerySet(QuerySet):
#
#     def a_status_order(self):
#
#         from api.main_models.contract import BaseContract
#
#         IN_PROCESS, APPROVED, EXPIRED, EXPIRES = range(0, 4)
#
#         two_week_for_expire = timezone.now() + timedelta(weeks=2)
#
#         return self.annotate(
#             status_order=Case(
#                 When(due_date=,
#                      then=Value(4)),
#                 default=Value('status'),
#                 output_field=IntegerField()
#             )
#         )
