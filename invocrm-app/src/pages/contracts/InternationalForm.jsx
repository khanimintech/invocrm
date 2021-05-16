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

const InternationalForm = ({ handleSubmit, handleRequest, handleClose, formType }) => {
    let formikRef = useRef();

    const [salesManagers, setSalesManagers] = useState([]);


    useEffect(() => {
        getSalesManagers()
    }, [])


    const getSalesManagers = () => {
        handleRequest(
            ContractsService.getSalesManagers()
        )
            .then(res => setSalesManagers(res.body.map(salesManager => ({ value: salesManager.id, label: salesManager.fullname }))))
    }



    return (
        <>
            <DialogContent>
                <DialogContentText>
                    <Formik
                        initialValues={{
                            due_date: new Date(),
                            created: new Date(),
                        }}
                        onSubmit={vals => handleSubmit({ ...vals })}
                        innerRef={form => (formikRef = form)}
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
                                        <CustomerContacts />
                                    </Grid>
                                    <BankRequisits />
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


export default InternationalForm;