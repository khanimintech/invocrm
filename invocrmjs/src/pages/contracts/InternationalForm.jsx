import React, { useRef } from 'react';
import { Formik, Form, Field } from 'formik';
import Grid from '@material-ui/core/Grid';
import Input from '../../components/Input';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import { validateRequired } from '../../utils';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import CreateFormActions from './CreateFormActions';
import { companyTypes, contractStatuses } from './../../constants';
import BankRequisits from './BankRequisits';
import CustomerContacts from './CustomerContacts';
import { parseISO } from 'date-fns'

const InternationalForm = ({ handleSubmit, handleRequest, handleClose, selectedContract, salesManagers, banks }) => {
  let formikRef = useRef();
  const { contract_no, company,
    created, due_date, id, sales_manager, country, responsible_person, executor,
    payment_condition, contact, bank, bank_account, status,
  } = selectedContract || {};




  return (
    <>
      <DialogContent className="create-contract-wrapper">
        <DialogContentText>
          <Formik
            initialValues={{
              id,
              due_date: due_date ? parseISO(due_date) : new Date(),
              created: created ? parseISO(created) : new Date(),
              contract_no,
              sales_manager,
              company,
              country,
              status,
              responsible_person: {
                position: responsible_person ? responsible_person.position : "",
                first_name: responsible_person ? responsible_person.first_name : "",
                last_name: responsible_person ? responsible_person.last_name : "",
                fathers_name: responsible_person ? responsible_person.fathers_name : "",
                type: responsible_person ? responsible_person.type : "",
              },
              executor,
              payment_condition,
              contact,
              bank,
              bank_account
            }}
            onSubmit={handleSubmit}
            innerRef={form => (formikRef = form)}
          >

            {({ values, setErrors }) => (
              <Form>
                <Grid container justify="space-between" spacing={5}>
                  <Grid item md={6} sm={12} xs={12}>
                    <Grid item md={12}>
                      <Typography variant="h6" gutterBottom>
                        Ümumi məlumatlar
                                    </Typography>
                    </Grid>
                    <Divider />
                    <Grid item md={12} className="input-wrapper">
                      <Field
                        validate={validateRequired}
                        name="contract_no"
                      >
                        {({ field, form, meta }) => (
                          <Input
                            label="Müqavilə nömrəsi"
                            field={field}
                            form={form}
                            meta={meta}
                          />
                        )}
                      </Field>
                    </Grid>
                    <Grid item md={12} >
                      <Grid container spacing={0} justify="space-between">
                        <Grid item md={7} className="input-wrapper">
                          <Field
                            validate={validateRequired}
                            name="company.name"
                          >
                            {({ field, form, meta }) => (
                              <Input
                                label="Müştəri/şirkət adı"
                                field={field}
                                form={form}
                                meta={meta}
                              />
                            )}
                          </Field>
                        </Grid>

                        <Grid item md={4} className="input-wrapper">
                          <Field
                            validate={validateRequired}
                            name="company.type"
                          >
                            {({ field, form, meta }) => (
                              <Input
                                label="Müştəri/şirkət növü"
                                field={field}
                                form={form}
                                meta={meta}
                                select
                                options={companyTypes}
                              />
                            )}
                          </Field>
                        </Grid>
                      </Grid>
                      <Grid item md={12} className="input-wrapper">
                        <Field
                          name="company.address"
                          validate={validateRequired}
                        >
                          {({ field, form, meta }) => (
                            <Input
                              label="Hüquqi ünvan"
                              field={field}
                              form={form}
                              meta={meta}
                            />
                          )}
                        </Field>
                      </Grid>

                      <Grid item md={12} className="input-wrapper">
                        <Field
                          name="country"
                          validate={validateRequired}
                        >
                          {({ field, form, meta }) => (
                            <Input
                              label="Ölkə"
                              field={field}
                              form={form}
                              meta={meta}
                            />
                          )}
                        </Field>
                      </Grid>
                      <Grid item md={12} className="input-wrapper">
                        <Field
                          name="company.email"
                          validate={validateRequired}
                        >
                          {({ field, form, meta }) => (
                            <Input
                              label="Email"
                              field={field}
                              form={form}
                              meta={meta}
                            />
                          )}
                        </Field>
                      </Grid>


                      <Grid item md={12} >
                        <Grid container spacing={0} justify="space-between">
                          <Grid item md={3} className="input-wrapper" >
                            <Field
                              name="executor.first_name"
                              validate={validateRequired}
                            >
                              {({ field, form, meta }) => (
                                <Input
                                  label="Direktor adı"
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
                              validate={validateRequired}
                            >
                              {({ field, form, meta }) => (
                                <Input
                                  label="Direktor soyadı"
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
                              validate={validateRequired}
                            >
                              {({ field, form, meta }) => (
                                <Input
                                  label="Direktor ata adı"
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
                        name="executor.position"
                        validate={validateRequired}
                      >
                        {({ field, form, meta }) => (
                          <Input
                            label="Vəzifə"
                            field={field}
                            form={form}
                            meta={meta}
                          />
                        )}
                      </Field>
                    </Grid>
                    <Grid item md={12} className="input-wrapper">
                      <Field
                        name="payment_condition"
                        validate={validateRequired}
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
                    <Grid item md={12} className="input-wrapper">
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
                        name="due_date"
                        validate={validateRequired}
                      >
                        {({ field, form, meta }) => (
                          <Input
                            label="Etibarlıdır"
                            field={field}
                            form={form}
                            meta={meta}
                            date
                          />
                        )}
                      </Field>
                    </Grid>
                    {
                      selectedContract ? (
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
                    <CustomerContacts values={values} setErrors={setErrors} />
                  </Grid>
                  <BankRequisits banks={banks} />
                </Grid>
              </Form>
            )}
          </Formik>
        </DialogContentText>
      </DialogContent>
      <CreateFormActions handleClose={handleClose} id={id} handleSave={() => formikRef.submitForm()} />

    </>
  )
}


export default InternationalForm;