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
import { parseISO } from 'date-fns';

const SalesForm = ({ handleSubmit, handleClose, formType, selectedContract, salesManagers, banks }) => {
  let formikRef = useRef();
  const { contract_no, company, executor, responsible_person,
    created, due_date, id, sales_manager, bank, bank_account, contact,
    subject_of_distribution, territory, custom_contract_type, executor_contact, status
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
              company: {
                name: company ? company.name : "",
                type: company ? company.type : "",
                address: company ? company.address : "",
                tin: company ? company.tin : null,
              },
              executor,
              executor_contact,
              contact,
              status,
              custom_contract_type,
              responsible_person: {
                first_name: responsible_person ? responsible_person.first_name : "",
                last_name: responsible_person ? responsible_person.last_name : "",
                fathers_name: responsible_person ? responsible_person.fathers_name : "",
                type: responsible_person ? responsible_person.type : "",
                position: responsible_person ? responsible_person.position : "",
              },
              bank,
              bank_account,
              subject_of_distribution: subject_of_distribution || "",
              territory: territory || ""
            }}
            onSubmit={handleSubmit}
            innerRef={form => (formikRef = form)}
          >

            {({ values, setErrors }) => (
              <Form>
                <Grid container spacing={0} justify="space-between" spacing={5}>
                  <Grid item md={6} sm={12} xs={12}>
                    <Grid item md={12}>
                      <Typography variant="h6" gutterBottom>
                        ??mumi m??lumatlar
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
                            label="M??qavil?? n??mr??si"
                            field={field}
                            form={form}
                            meta={meta}
                          />
                        )}
                      </Field>
                    </Grid>
                    {
                      formType === 9 ? (
                        <Grid item md={12} className="input-wrapper">
                          <Field
                            validate={validateRequired}
                            name="custom_contract_type"
                          >
                            {({ field, form, meta }) => (
                              <Input
                                label="M??qavil?? n??v??"
                                field={field}
                                form={form}
                                meta={meta}
                                select
                                options={[
                                  { label: "Alq??-satq??", value: 1 },
                                  { label: "Xidm??t", value: 2 },
                                  { label: "Distribyutor", value: 3 },
                                  { label: "Agent", value: 4 },
                                  { label: "??car??", value: 5 },
                                  { label: "Bir-d??f??lik", value: 6 },
                                  { label: "Beyn??lxalq m??qavil??", value: 7 },
                                ]}
                              />
                            )}
                          </Field>
                        </Grid>
                      ) : null
                    }


                    <Grid item md={12} >
                      <Grid container spacing={0} justify="space-between">
                        <Grid item md={7} className="input-wrapper">
                          <Field
                            validate={validateRequired}
                            name="company.name"
                          >
                            {({ field, form, meta }) => (
                              <Input
                                label="M????t??ri/??irk??t ad??"
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
                                label="M????t??ri/??irk??t n??v??"
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
                      {
                        formType === 3 ? (
                          <>
                            <Grid item md={12} className="input-wrapper">
                              <Field
                                name="subject_of_distribution"
                                validate={validateRequired}
                              >
                                {({ field, form, meta }) => (
                                  <Input
                                    label="M??qavilenin predmeti"
                                    field={field}
                                    form={form}
                                    meta={meta}
                                  />
                                )}
                              </Field>
                            </Grid>
                            <Grid item md={12} className="input-wrapper">
                              <Field
                                name="territory"
                                validate={validateRequired}
                              >
                                {({ field, form, meta }) => (
                                  <Input
                                    label="??razi"
                                    field={field}
                                    form={form}
                                    meta={meta}
                                  />
                                )}
                              </Field>
                            </Grid>
                          </>
                        ) : null
                      }
                      {/* {
                                                formType === 9 ? null : ( */}
                      <Grid item md={12} className="input-wrapper">
                        <Field
                          name="company.address"
                          validate={validateRequired}
                        >
                          {({ field, form, meta }) => (
                            <Input
                              label="H??quqi ??nvan"
                              field={field}
                              form={form}
                              meta={meta}
                            />
                          )}
                        </Field>
                      </Grid>
                      {/* )
                                            } */}
                      <Grid item md={12} >
                        <Grid container spacing={0} justify="space-between">
                          <Grid item md={3} className="input-wrapper" >
                            <Field
                              name="executor.first_name"
                              validate={validateRequired}
                            >
                              {({ field, form, meta }) => (
                                <Input
                                  label="Direktor ad??"
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
                                  label="Direktor soyad??"
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
                                  label="Direktor ata ad??"
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
                    <Grid item md={12} className="input-wrapper">
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
                    <Grid item md={12} className="input-wrapper">
                      <Field
                        name="due_date"
                        validate={validateRequired}
                      >
                        {({ field, form, meta }) => (
                          <Input
                            label="Etibarl??d??r"
                            field={field}
                            form={form}
                            meta={meta}
                            date
                          />
                        )}
                      </Field>
                    </Grid>
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


export default SalesForm;