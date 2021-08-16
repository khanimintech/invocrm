import React, { useRef } from 'react';
import { Formik, Form, Field } from 'formik';
import Grid from '@material-ui/core/Grid';
import Input from '../../../components/Input';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import { validateRequired } from '../../../utils';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import CreateFormActions from '../CreateFormActions';
import CreateAnnex from '../CreateAnnex';


const OneTimeForm = ({ handleSubmit, contract, handleClose, salesManagers, selectedAnnex, units, sellers }) => {
  let formikRef = useRef();
  return (
    <>
      <DialogContent>
        <DialogContentText>
          <Formik
            initialValues={{
              ...selectedAnnex,
              status: selectedAnnex && selectedAnnex.status ? selectedAnnex.status : 0,
              products: selectedAnnex && selectedAnnex.products && selectedAnnex.products.length > 0 ? selectedAnnex.products : [
                {
                  name: "",
                  quantity: 0,
                  unit: 0,
                  price: "",
                  total: 0,
                  index: 1,
                },
              ],
              total: selectedAnnex ? selectedAnnex.total : null,
              revision: selectedAnnex && selectedAnnex.revision!== undefined ? selectedAnnex.revision : false,
            }}
            onSubmit={handleSubmit}
            innerRef={form => (formikRef = form)}
            enableReinitialize
          >

            {({ values }) => (
              <Form>
                <Grid container justify="space-between" >
                  <Grid item md={12} sm={12} xs={12}>
                    {
                      contract ? (
                        <>
                          <Typography variant="subtitle1" gutterBottom>
                            Ümumi məlumatlar
												</Typography>
                          <Divider />
                        </>
                      ) : null
                    }
                    <Grid container spacing={0}>
                      {
                        contract ? (
                          <Grid item md={6}>
                            <Typography variant="subtitle1" gutterBottom>
                              {`Müqavilə №: ${contract.contract_no}`}
                            </Typography>
                            <Typography variant="subtitle1" gutterBottom>
                              {`Əlavə №: ${contract.annex_count + 1}`}
                            </Typography>
                            <Typography variant="subtitle1" gutterBottom>
                              {`Agent: ${contract.executor_name}`}
                            </Typography>
                          </Grid>
                        ) : null
                      }
                      <Grid item md={6} sm={12} xs={12} className="input-wrapper">
                        <Field
                          name="created"
                          validate={validateRequired}
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
                    </Grid>
                    <Grid container spacing={0}>
                        <Grid item md={6} sm={12} xs={12} className="input-wrapper">
                          <Field
                            name="request_no"
                          >
                            {({ field, form, meta }) => (
                              <Input
                                label="Sorğu №"
                                field={field}
                                form={form}
                                meta={meta}
                              />
                            )}
                          </Field>
                        </Grid>
                        <Grid item md={6} sm={12} xs={12} className="input-wrapper">
                          <Field
                            name="payment_terms"
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
                      </Grid>
                      <Grid container>
                        <Grid item md={6} sm={12} xs={12} className="input-wrapper">
                          <Field
                            name="delivery_terms"
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
                        <Grid item md={6} sm={12} xs={12} className="input-wrapper">
                          <Field
                            name="acquisition_terms"
                          >
                            {({ field, form, meta }) => (
                              <Input
                                label="Məhsulun təhvili"
                                field={field}
                                form={form}
                                meta={meta}
                              />
                            )}
                          </Field>
                        </Grid>
                      </Grid>
                      <Grid container>
                        <Grid item md={6} sm={12} xs={12} className="input-wrapper">
                          <Field
                            name="seller"
                          >
                            {({ field, form, meta }) => (
                              <Input
                                label="Satıcı"
                                field={field}
                                form={form}
                                meta={meta}
                                options={sellers}
                                select
                              />
                            )}
                          </Field>
                        </Grid>
                        <Grid item md={6} className="input-wrapper">
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
                      </Grid>
                      <Grid container>
                        <Grid item md={6} className="input-wrapper">
                          <Field
                            name="status"
                            validate={validateRequired}
                          >
                            {({ field, form, meta }) => (
                              <Input
                                label="Status"
                                field={field}
                                form={form}
                                meta={meta}
                                select
                                options={[
                                  { value: 0, label: "Prosesdə" },
                                  { value: 1, label: "Təsdiqlənib" },
                                  { value: 2, label: "Ləğv edilib" }
                                ]}
                              />
                            )}
                          </Field>
                        </Grid>
                        {
                          selectedAnnex ? (
                            <Grid item md={6} className="input-wrapper">
                              <Field
                                name="revision"
                              >
                                {({ field, form, meta }) => (
                                  <Input
                                    label="Reviziya"
                                    field={field}
                                    form={form}
                                    meta={meta}
                                    checkbox
                                  />
                                )}
                              </Field>
                            </Grid>
                          ) : (
                              <Grid item md={6} className="input-wrapper">
                                <Field
                                  validate={validateRequired}
                                  name={`annex_no`}
                                >
                                  {({ field, form, meta }) => (
                                    <>
                                      <Input
                                        label="Annex nömrəsi"
                                        field={field}
                                        form={form}
                                        meta={meta}
                                      />
                                    </>
                                  )}
                                </Field>
                              </Grid>
                            )
                        }
                      </Grid>
                      {
                        selectedAnnex ? (
                          <Grid container>
                            <Grid item md={6} className="input-wrapper">
                              <Field
                                validate={validateRequired}
                                name={`annex_no`}
                              >
                                {({ field, form, meta }) => (
                                  <>
                                    <Input
                                      label="Annex nömrəsi"
                                      field={field}
                                      form={form}
                                      meta={meta}
                                    />
                                  </>
                                )}
                              </Field>
                            </Grid>
                          </Grid>
                        ) : null
                      }
                    <Divider />
                    <br />
                    <Grid container spacing={0} justify="space-between" >
                      <Grid item md={12}>
                        <CreateAnnex products={values.products} productsFieldName="products" type={1} total={values.total || 0} units={units} />
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Form>
            )}
          </Formik>
        </DialogContentText>
      </DialogContent>
      <CreateFormActions handleClose={handleClose} handleSave={() => formikRef.submitForm()} />
    </>
  )
}



export default OneTimeForm;