from django.db.models import QuerySet, Sum, OuterRef, Subquery




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



