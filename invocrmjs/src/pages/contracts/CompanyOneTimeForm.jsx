import React from 'react';
import { Field } from 'formik';
import Grid from '@material-ui/core/Grid';
import Input from '../../components/Input';
import { contractStatuses } from '../../constants';


const CompanyOneTimeForm = ({ salesManagers, id }) => {
  return (
    <>
      <Grid item md={12} className="input-wrapper">
        <Field
          name="company.name"
        >
          {({ field, form, meta }) => (
            <Input
              label="Alıcı (Şirkət adı)"
              field={field}
              form={form}
              meta={meta}
            />
          )}
        </Field>
      </Grid>

      <Grid item md={12} >
        <Grid item md={12} >
          <Grid container spacing={0} justify="space-between">
            <Grid item md={3} className="input-wrapper" >
              <Field
                name="executor.first_name"
              >
                {({ field, form, meta }) => (
                  <Input
                    label="Alıcı adı"
                    field={field}
                    form={form}
                    meta={meta}
                  />
                )}
              </Field>
            </Grid>
            <Grid item md={3} className="input-wrapper">
              <Field
                name="executor.last_name"
              >
                {({ field, form, meta }) => (
                  <Input
                    label="Alıcı soyadı"
                    field={field}
                    form={form}
                    meta={meta}
                  />
                )}
              </Field>
            </Grid>
            <Grid item md={3} className="input-wrapper">
              <Field
                name="executor.fathers_name"
              >
                {({ field, form, meta }) => (
                  <Input
                    label="Alıcı ata adı"
                    field={field}
                    form={form}
                    meta={meta}
                  />
                )}
              </Field>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Grid item md={12} className="input-wrapper">
        <Field
          name="company.tin"
        >
          {({ field, form, meta }) => (
            <Input
              label="VOEN"
              field={field}
              form={form}
              meta={meta}
            />
          )}
        </Field>
      </Grid>
      <Grid item md={12} className="input-wrapper">
        <Field
          name={!id ? "executor_contact.mobile" : "executor.contact.mobile"}
        >
          {({ field, form, meta }) => (
            <Input
              label="Alıcı (əlaqə telefonu)"
              field={field}
              form={form}
              meta={meta}
            />
          )}
        </Field>
      </Grid>
      <Grid item md={12} className="input-wrapper">
        <Field
          name={!id ? "executor_contact.personal_email" : "executor.contact.personal_email"}
        >
          {({ field, form, meta }) => (
            <Input
              label="Alıcı e-ünvan"
              field={field}
              form={form}
              meta={meta}
            />
          )}
        </Field>
      </Grid>


      <Grid item md={12} >
        <Grid item md={12} >
          <Grid container spacing={0} justify="space-between">
            <Grid item md={3} className="input-wrapper" >
              <Field
                name="annex.seller.first_name"
              >
                {({ field, form, meta }) => (
                  <Input
                    label="Satıcı adı"
                    field={field}
                    form={form}
                    meta={meta}
                  />
                )}
              </Field>
            </Grid>
            <Grid item md={3} className="input-wrapper">
              <Field
                name="annex.seller.last_name"
              >
                {({ field, form, meta }) => (
                  <Input
                    label="Satıcı soyadı"
                    field={field}
                    form={form}
                    meta={meta}
                  />
                )}
              </Field>
            </Grid>
            <Grid item md={3} className="input-wrapper">
              <Field
                name="annex.seller.fathers_name"
              >
                {({ field, form, meta }) => (
                  <Input
                    label="Satıcı ata adı"
                    field={field}
                    form={form}
                    meta={meta}
                  />
                )}
              </Field>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Grid item md={12} className="input-wrapper">
        <Field
          name="annex.seller.position"
        >
          {({ field, form, meta }) => (
            <Input
              label="Satıcı vəzifəsi"
              field={field}
              form={form}
              meta={meta}
            />
          )}
        </Field>
      </Grid>
      <Grid item md={12} className="input-wrapper">
        <Field
          name="annex.request_no"
        >
          {({ field, form, meta }) => (
            <Input
              label="Sorğu NO"
              field={field}
              form={form}
              meta={meta}
            />
          )}
        </Field>
      </Grid>


      <Grid item md={12} className="input-wrapper">
        <Field
          name="sales_manager"
        >
          {({ field, form, meta }) => (
            <Input
              label="Satış meneceri"
              field={field}
              form={form}
              meta={meta}
              select
              options={salesManagers}
            />
          )}
        </Field>
      </Grid>

      <Grid item md={12} className="input-wrapper">
        <Field
          name="final_amount_with_writing"
        >
          {({ field, form, meta }) => (
            <Input
              label="Yazı ilə yekun məbləğ"
              field={field}
              form={form}
              meta={meta}
            />
          )}
        </Field>
      </Grid>
      <Grid item md={12} className="input-wrapper">
        <Field
          name="annex.payment_terms"
        >
          {({ field, form, meta }) => (
            <Input
              label="Ödəniş şərti"
              field={field}
              form={form}
              meta={meta}
            />
          )}
        </Field>
      </Grid>
      <Grid item md={12} className="input-wrapper">
        <Field
          name="annex.acquisition_terms"
        >
          {({ field, form, meta }) => (
            <Input
              label="Təhvil müddəti"
              field={field}
              form={form}
              meta={meta}
            />
          )}
        </Field>
      </Grid>

      <Grid item md={12} className="input-wrapper">
        <Field
          name="annex.delivery_terms"
        >
          {({ field, form, meta }) => (
            <Input
              label="Çatdırılma şərti"
              field={field}
              form={form}
              meta={meta}
            />
          )}
        </Field>
      </Grid>

      <Grid item md={12} className="input-wrapper">
        <Field
          name="price_offer"
        >
          {({ field, form, meta }) => (
            <Input
              label="Qiymət təklifi"
              field={field}
              form={form}
              meta={meta}
            />
          )}
        </Field>
      </Grid>

      <Grid item md={12} className="input-wrapper">
        <Field
          name="price_offer_validity"
        >
          {({ field, form, meta }) => (
            <Input
              label="Qiymət təklifinin qüvvədə olma müddəti"
              field={field}
              form={form}
              meta={meta}
            />
          )}
        </Field>
      </Grid>

      <Grid item md={12} className="input-wrapper">
        <Field
          name="warranty_period"
        >
          {({ field, form, meta }) => (
            <Input
              label="Zəmanət müddəti"
              field={field}
              form={form}
              meta={meta}
            />
          )}
        </Field>
      </Grid>

      <Grid item md={12} className="input-wrapper">
        <Field
          name="unpaid_period"
        >
          {({ field, form, meta }) => (
            <Input
              label="Ödənişsiz saxlama müddəti"
              field={field}
              form={form}
              meta={meta}
            />
          )}
        </Field>
      </Grid>
      <Grid item md={12} className="input-wrapper">
        <Field
          name="unpaid_value"
        >
          {({ field, form, meta }) => (
            <Input
              label="Ödənişsiz saxlama dəyəri"
              field={field}
              form={form}
              meta={meta}
            />
          )}
        </Field>
      </Grid>
      <Grid item md={12} className="input-wrapper">
        <Field
          name="part_acquisition"
        >
          {({ field, form, meta }) => (
            <Input
              label="Hissə hissə təhvil"
              field={field}
              form={form}
              meta={meta}
            />
          )}
        </Field>
      </Grid>
      <Grid item md={12} className="input-wrapper">
        <Field
          name="part_payment"
        >
          {({ field, form, meta }) => (
            <Input
              label="Hissə hissə ödəniş"
              field={field}
              form={form}
              meta={meta}
            />
          )}
        </Field>
      </Grid>
      <Grid item md={12} className="input-wrapper">
        <Field
          name="standard"
        >
          {({ field, form, meta }) => (
            <Input
              label="Standart"
              field={field}
              form={form}
              meta={meta}
            />
          )}
        </Field>
      </Grid>
      <Grid item md={12} className="input-wrapper">
        <Field
          name="created"
        >
          {({ field, form, meta }) => (
            <Input
              label="Yaradılma tarixi"
              field={field}
              form={form}
              meta={meta}
              date
            />
          )}
        </Field>
      </Grid>
      {
        id ? (
          <Grid item md={12} className="input-wrapper">
             <Field
                name="status"

              >
                {({ field, form, meta }) => (
                  <Input
                    label="Status"
                    field={field}
                    form={form}
                    meta={meta}
                    select
                    options={contractStatuses.filter(s => s.value !== 3)}
                  />
                )}
              </Field>
          </Grid>
        ) : null
      }
    </>
  )
}


export default CompanyOneTimeForm;