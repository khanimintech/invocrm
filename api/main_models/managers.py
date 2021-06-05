from django.db.models import QuerySet, Sum, F, FloatField, Subquery, OuterRef, IntegerField


class AnnexQuerySet(QuerySet):

    def a_invoice_sum(self):

        from api.main_models.annex import ProductInvoiceItem

        # queryset = self.annotate(
        #     sum_no_invoice=Sum(
        #         Subquery(ProductInvoiceItem.objects.filter(
        #             annex=OuterRef('id'), annex__with_vat=False).values('total')), output_field=IntegerField(default=0)),
        #     sum_with_invoice=Sum(
        #         Subquery(ProductInvoiceItem.objects.filter(
        #             annex=OuterRef('id'), annex__with_vat=True).values('total'), output_field=FloatField(default=0)),
        #
        # ))

        queryset = self.annotate(sum_no_invoice=Sum('products__total'),
                                 sum_with_invoice=Sum(F('products__total') * 1.18, output_field=FloatField()))

        return queryset
