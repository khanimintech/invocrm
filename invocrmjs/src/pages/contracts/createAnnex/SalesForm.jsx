import React, { useRef } from 'react';
import { Formik, Form, Field } from 'formik';
import Grid from '@material-ui/core/Grid';
import Input from '../../../components/Input';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import { validateRequired } from '../../../utils';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import { format, parseISO } from 'date-fns'
import { contractTypes } from '../../../constants';
import CreateFormActions from '../CreateFormActions';
import CreateAnnex from '../CreateAnnex';


const SalesForm = ({ handleSubmit, contract, sellers, handleClose, units, salesManagers, hideAnnexTable, selectedAnnex }) => {
  let formikRef = useRef();

  return (
    <>
      <DialogContent>
        <DialogContentText>
          <Formik
            initialValues={{
              ...selectedAnnex,
              status: selectedAnnex && selectedAnnex.status ? selectedAnnex.status : 0,
              total: selectedAnnex ? selectedAnnex.total : null,
              revision: selectedAnnex && selectedAnnex.revision !== undefined ? selectedAnnex.revision : false,
              products: hideAnnexTable ? null : (selectedAnnex && selectedAnnex.products && selectedAnnex.products.length ? selectedAnnex.products : [
                {
                  name: "",
                  quantity: 0,
                  unit: 0,
                  price: 0,
                  total: 0,
                }
              ])
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
                            ??mumi m??lumatlar
												</Typography>
                          <Divider />
                        </>
                      ) : null
                    }

                    {
                      contract ? (
                        <Grid container>
                          <Grid item md={6}>
                            <Typography variant="subtitle1" gutterBottom>
                              {`??irk??t/M????t??ri: ${contract.company_name}`}
                            </Typography>
                            <Typography variant="subtitle1" gutterBottom>
                              {`M??qavil?? N??v??: ${contractTypes[contract.type]}`}
                            </Typography>
                            <Typography variant="subtitle1" gutterBottom>
                              {`M??qavil?? ???: ${contract.contract_no}`}
                            </Typography>
                          </Grid>
                          <Grid item md={6}>
                            <Typography variant="subtitle1" gutterBottom>
                              {`Tarix : ${contract.created ? format(parseISO(contract.created), "MM.dd.yyyy") : "-"}`}
                            </Typography>
                            <Typography variant="subtitle1" gutterBottom>
                              {`??lav?? ??? : ${contract.annex_count + 1}`}
                            </Typography>
                          </Grid>
                        </Grid>
                      ) : null
                    }
                    <Grid container justify="space-between" >
                      <Grid item md={6} sm={12} xs={12} className="input-wrapper">
                        <Field
                          name="created"
                          validate={validateRequired}
                        >
                          {({ field, form, meta }) => (
                            <Input
                              label="Yarad??lma tarixi"
                              field={field}
                              form={form}
                              meta={meta}
                              date
                            />
                          )}
                        </Field>
                      </Grid>
                      <Grid item md={6} sm={12} xs={12} className="input-wrapper">
                        <Field
                          name="note"
                        >
                          {({ field, form, meta }) => (
                            <Input
                              label="Qeyd"
                              field={field}
                              form={form}
                              meta={meta}
                              multiline
                              rows={2}
                            />
                          )}
                        </Field>
                      </Grid>
                      <Grid container spacing={0}>
                        <Grid item md={6} sm={12} xs={12} className="input-wrapper">
                          <Field
                            name="request_no"
                            validate={validateRequired}
                          >
                            {({ field, form, meta }) => (
                              <Input
                                label="Sor??u ???"
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
                            validate={validateRequired}
                          >
                            {({ field, form, meta }) => (
                              <Input
                                label="??d??ni?? ????rti"
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
                            validate={validateRequired}
                          >
                            {({ field, form, meta }) => (
                              <Input
                                label="??atd??r??lma ????rti"
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
                            validate={validateRequired}
                          >
                            {({ field, form, meta }) => (
                              <Input
                                label="M??hsulun t??hvili"
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
                            validate={validateRequired}
                          >
                            {({ field, form, meta }) => (
                              <Input
                                label="Sat??c??"
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
                            validate={validateRequired}
                          >
                            {({ field, form, meta }) => (
                              <Input
                                label="Sat???? meneceri"
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
                                  { value: 0, label: "Prosesd??" },
                                  { value: 1, label: "T??sdiql??nib" },
                                  { value: 2, label: "L????v edilib" }
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
                                        label="Annex n??mr??si"
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
                                      label="Annex n??mr??si"
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
                      <Grid item md={12}>
                        <CreateAnnex products={values.products} units={units} type={1} total={values.total || 0} hideAnnexTable={hideAnnexTable} />
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


export default SalesForm;