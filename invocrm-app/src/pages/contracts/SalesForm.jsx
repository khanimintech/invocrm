import React, { useState, useEffect, useRef } from 'react';
import { Formik, Form, Field } from 'formik';
import Grid from '@material-ui/core/Grid';
import Input from '../../components/Input';
import { ContractsService } from '../../services/ContractsService';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import { validateRequired } from '../../utils';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import CreateFormActions from './CreateFormActions';
import { companyTypes } from './../../constants';
import BankRequisits from './BankRequisits';
import CustomerContacts from './CustomerContacts';
import { parseISO } from 'date-fns';

const SalesForm = ({ handleSubmit, handleRequest, handleClose, formType, selectedContract, salesManagers }) => {
    let formikRef = useRef();
    const {contract_no, company, executor, responsible_person,
        created, due_date, id, sales_manager, type ,
    } = selectedContract || {};


    return (
        <>
            <DialogContent className="create-contract-wrapper">
                <DialogContentText>
                    <Formik
                        initialValues={{
                            id,
                            due_date: due_date? parseISO(due_date) : new Date(),
                            created: created ? parseISO(created)  : new Date(),
                            contract_no,
                            sales_manager,
                            company: {
                                name: company ? company.name : "",
                                type: company ? company.type : "",
                                address: company ? company.address : ""
                            },
                            executor: {
                                first_name: executor ? executor.first_name : "",
                                last_name: executor ? executor.last_name : "",
                                fathers_name: executor ? executor.fathers_name : ""
                            }
                        }}
                        onSubmit={vals => handleSubmit({ ...vals })}
                        innerRef={form => (formikRef = form)}
                        enableReinitialize
                    >

                        {() => (
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
                                                        readOnly={id}
                                                    />
                                                )}
                                            </Field>
                                        </Grid>
                                        {
                                            formType === 9? (
                                                <Grid item md={12} className="input-wrapper">
                                            <Field
                                                validate={validateRequired}
                                                name="custom_contract_type"
                                            >
                                                {({ field, form, meta }) => (
                                                    <Input
                                                        label="Müqavilə növü"
                                                        field={field}
                                                        form={form}
                                                        meta={meta}
                                                        select
                                                        readOnly={id}
                                                        options={[
                                                            {label: "Alqı-satqı", value: 1},
                                                            {label: "Xidmət", value: 2},
                                                            {label: "Distribyutor", value: 3},
                                                            {label: "Agent", value: 4},
                                                        ]}
                                                    />
                                                )}
                                            </Field>
                                        </Grid>
                                            ): null
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
                                                                label="Müştəri/şirkət adı"
                                                                field={field}
                                                                form={form}
                                                                meta={meta}
                                                                readOnly={id}
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
                                                                readOnly={id}
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
                                                                        label="Müqavilenin predmeti"
                                                                        field={field}
                                                                        form={form}
                                                                        meta={meta}
                                                                        readOnly={id}
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
                                                                        label="Ərazi"
                                                                        field={field}
                                                                        form={form}
                                                                        meta={meta}
                                                                        readOnly={id}
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
                                                                    label="Hüquqi ünvan"
                                                                    field={field}
                                                                    form={form}
                                                                    meta={meta}
                                                                    readOnly={id}
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
                                                                    label="Direktor adı"
                                                                    field={field}
                                                                    form={form}
                                                                    meta={meta}
                                                                    readOnly={id}
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
                                                                    readOnly={id}
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
                                                                    readOnly={id}
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
                                                        label="Satış meneceri"
                                                        field={field}
                                                        form={form}
                                                        meta={meta}
                                                        select
                                                        options={salesManagers}
                                                        readOnly={id}
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
                                                        readOnly={id}
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
                                                        readOnly={id}
                                                    />
                                                )}
                                            </Field>
                                        </Grid>
                               
                         
                                        <CustomerContacts readOnly={id} />
                                    </Grid>
                                    <BankRequisits  readOnly={id}  />
                                </Grid>
                            </Form>
                        )}
                    </Formik>
                </DialogContentText>
            </DialogContent>
            {
                id ? null : (
                    <CreateFormActions handleClose={handleClose} handleSave={() => formikRef.submitForm()} />
                )
            }
            
        </>
    )
}


export default SalesForm;