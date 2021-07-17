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
import BankRequisits from './BankRequisits';
import CustomerContacts from './CustomerContacts';
import { parseISO } from 'date-fns'
import { contractStatuses } from '../../constants';

const AgentForm = ({ handleSubmit, handleRequest, handleClose, formType, selectedContract, salesManagers, banks }) => {
  let formikRef = useRef();
  const { contract_no, executor, responsible_person,
    created, due_date, id, sales_manager, bank, bank_account, contact, status,
    territory
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
              executor,
              contact,
              status,
              responsible_person: {
                first_name: responsible_person ? responsible_person.first_name : "",
                last_name: responsible_person ? responsible_person.last_name : "",
                fathers_name: responsible_person ? responsible_person.fathers_name : "",
                type: responsible_person ? responsible_person.type : "",
                position: responsible_person ? responsible_person.position : null,
              },
              bank,
              bank_account,
              territory: territory,
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
                        <Grid item md={3} className="input-wrapper">
                          <Field
                            validate={validateRequired}
                            name="executor.first_name"
                          >
                            {({ field, form, meta }) => (
                              <Input
                                label="Sahibkar adı"
                                field={field}
                                form={form}
                                meta={meta}
                              />
                            )}
                          </Field>
                        </Grid>
                        <Grid item md={3} className="input-wrapper">
                          <Field
                            validate={validateRequired}
                            name="executor.last_name"
                          >
                            {({ field, form, meta }) => (
                              <Input
                                label="Sahibkar soyadı"
                                field={field}
                                form={form}
                                meta={meta}
                              />
                            )}
                          </Field>
                        </Grid>
                        <Grid item md={3} className="input-wrapper">
                          <Field
                            validate={validateRequired}
                            name="executor.fathers_name"
                          >
                            {({ field, form, meta }) => (
                              <Input
                                label="Sahibkar ata adı"
                                field={field}
                                form={form}
                                meta={meta}
                              />
                            )}
                          </Field>
                        </Grid>


                      </Grid>

                      <Grid item md={12} className="input-wrapper">
                        <Field
                          name="territory"
                          validate={validateRequired}
                        >
                          {({ field, form, meta }) => (
                            <Input
                              label="Ərazi"
                              field={field}
                              form={form}
                              meta={meta}
                            />
                          )}
                        </Field>
                      </Grid>

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
                                options={contractStatuses}
                              />
                            )}
                          </Field>
                        </Grid>
                      ) : null
                    }
                    <CustomerContacts values={values} setErrors={setErrors} />
                  </Grid>
                  <BankRequisits hideTin type={4} banks={banks} />
                </Grid>
              </Form>
            )}
          </Formik>
        </DialogContentText>
      </DialogContent>
      <CreateFormActions id={id} handleClose={handleClose} handleSave={() => formikRef.submitForm()} />
    </>
  )
}


export default AgentForm;