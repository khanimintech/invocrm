from django.db.models import QuerySet, Sum, F, FloatField, Subquery, OuterRef, IntegerField, Case, When


class AnnexQuerySet(QuerySet):

    def a_invoice_sum(self):

        queryset = self.annotate(sum_no_invoice=Case(When(total__isnull=True, then=Sum('products__total')),
                                                     When(total__isnull=False, then='total')),

                                 sum_with_invoice=Case(When(total__isnull=True, then=Sum(F('products__total') * 1.18)),
                                                       When(total__isnull=False, then=F('total') * 1.18)),

                                 sum_no_invoice_rent=Case(When(total__isnull=True, then=Sum('rent_items__total')),
                                                          When(total__isnull=False, then='total')),

                                 sum_with_invoice_rent=Case(When(total__isnull=True, then=Sum(F('rent_items__total') * 1.18)),
                                                            When(total__isnull=False, then=F('total') * 1.18))
                                 )

        return queryset
