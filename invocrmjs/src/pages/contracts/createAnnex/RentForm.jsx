import React, { useRef } from 'react';
import { Formik, Form, Field, FieldArray } from 'formik';
import Grid from '@material-ui/core/Grid';
import Input from '../../../components/Input';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import { validateRequired } from '../../../utils';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import CreateFormActions from '../CreateFormActions';
import CreateAnnex from '../CreateAnnex';
import IconButton from '@material-ui/core/IconButton';
import ControlPointIcon from '@material-ui/icons/ControlPoint';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import { format, parseISO } from 'date-fns'


const RentForm = ({ handleSubmit, contract, handleClose, units, salesManagers, selectedAnnex }) => {
  let formikRef = useRef();
  return (
    <>
      <DialogContent>
        <DialogContentText>
          <Formik
            initialValues={{
              ...selectedAnnex,
              status: selectedAnnex && selectedAnnex.status ? selectedAnnex.status : 0,
              rent_items: selectedAnnex && selectedAnnex.rent_items && selectedAnnex.rent_items.length ? selectedAnnex.rent_items : [
                {
                  quantity: 0,
                  one_day_rent: 0,
                },
              ],
              rent_conditions: selectedAnnex && selectedAnnex.rent_conditions && selectedAnnex.rent_conditions.length ? selectedAnnex.rent_conditions : [
                {
                  name: ""
                }
              ],
              total: selectedAnnex ? selectedAnnex.total : null,
              revision: selectedAnnex && selectedAnnex.revision !== undefined ? selectedAnnex.revision : false,
            }}
            onSubmit={handleSubmit}
            innerRef={form => (formikRef = form)}
            enableReinitialize
          >

            {({ values }) => (
              <Form>
                <Grid container justify="space-between" spacing={5}>
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

                    <Grid container spacing={1}>

                      <Grid item md={6}>
                        {
                          contract ? (
                            <>
                              <Typography variant="subtitle1" gutterBottom>
                                {`Əlavə №: ${contract.annex_count + 1}`}
                              </Typography>
                              <Typography variant="subtitle1" gutterBottom>
                                {`Müqavilə yaradılma tarixi:  ${contract.created ? format(parseISO(contract.created), "MM.dd.yyyy") : "-"}`}
                              </Typography>

                              <Typography variant="subtitle1" gutterBottom>
                                {`Müqavilə №: ${contract.contract_no}`}
                              </Typography>

                              <Typography variant="subtitle1" gutterBottom>
                                {`Şirkət: ${contract.company_name}`}
                              </Typography>
                            </>
                          ) : null
                        }


                        <FieldArray
                          validate={validateRequired}
                          name="rent_conditions"
                          render={arrayHelpers => (
                            <>
                              {values.rent_conditions.map((val, index) => (
                                <Grid container spacing={0}>
                                  <Grid item className="input-wrapper" md={11} key={index}>
                                    <Field
                                      validate={validateRequired}
                                      name={`rent_conditions[${index}].name`}
                                    >
                                      {({ field, form, meta }) => (
                                        <>
                                          <Input
                                            label="Şərt"
                                            field={field}
                                            form={form}
                                            meta={meta}
                                          // readOnly={id}
                                          />
                                        </>
                                      )}
                                    </Field>
                                  </Grid>
                                  {
                                    (index === values.rent_conditions.length - 1 ? (
                                      <Grid item md={1} className="icon-wrapper align-center" >
                                        <IconButton onClick={() => arrayHelpers.push({ name: '' })} size="small">
                                          <ControlPointIcon fontSize="default" color="primary" />
                                        </IconButton>
                                      </Grid>
                                    ) : (
                                        <Grid item md={1} className="icon-wrapper align-center">
                                          <IconButton onClick={() => arrayHelpers.remove(index)} size="small">
                                            <HighlightOffIcon fontSize="default" color="error" />
                                          </IconButton>
                                        </Grid>
                                      )
                                    )}
                                </Grid>
                              ))}
                            </>
                          )}
                        />
                        <Grid container>
                          <Grid item  md={12} className="input-wrapper">
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
                            <Grid container>
                              <Grid item md={12} className="input-wrapper">
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
                        </Grid>

                      </Grid>
                        
                      <Grid item md={6}>
                        <Grid container spacing={0}>
                          <Grid item md={12} sm={12} className="input-wrapper">
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
                          <Grid item md={12} className="input-wrapper">
                            <Field
                              name="sales_manager"
                              validate={validateRequired}
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
                          <Grid item md={12} sm={12} xs={12} className="input-wrapper">
                                <Field
                                  name="request_no"
                                  validate={validateRequired}
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
                            {
                              selectedAnnex ? (
                                <Grid item md={12}>
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
                              ) : null
                            }
                      
                        </Grid>
      

                      </Grid>
            



                    </Grid>
                    {!selectedAnnex ? <br /> : null}
                    <Divider />
                    <br />
                    <Grid container justify="space-between" spacing={5}>
                      <Grid item md={12} type="agent">
                        <CreateAnnex products={values.rent_items} productsFieldName="rent_items" type={5} units={units} total={values.total || 0} />
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


export default RentForm;