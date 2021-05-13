import React, { useState, useEffect, useRef } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import Grid from '@material-ui/core/Grid';
import Input from '../../components/Input';
import { ContractsService } from '../../services/ContractsService';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import { validateRequired } from '../../utils';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import CreateFormActions from './CreateFormActions';

const companyTypes = [
    { label: "MMC", value: 1 },
    { label: "ASC", value: 2 },
    { label: "QSC", value: 3 },
]

const SalesForm = ({ handleSubmit, handleRequest, handleClose }) => {
    let formikRef = useRef();

    const [salesManagers, setSalesManagers] = useState([]);


    useEffect(() => {
        getSalesManagers()
    }, [])


    const getSalesManagers = () => {
        handleRequest(
            ContractsService.getSalesManagers()
        )
            .then(res => setSalesManagers(res.body.map(salesManager => ({ value: salesManager.id, label: salesManager.fullname}))))
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
                onSubmit={vals => handleSubmit({ ...vals,  type: 1})}
                innerRef={form => (formikRef = form)}
                >

                {({ errors }) => (
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
                                        <Grid container spacing={0} justify="space-between">
                                            <Grid item md={3}>
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
                                <Grid item md={12} className="input-wrapper">
                                    <Typography variant="h6" gutterBottom>
                                        Müştəri ilə əlaqə məlumatları
                                    </Typography>
                                </Grid>
                                <Divider />
                                <Grid container spacing={0} justify="space-between">
                                    <Grid item md={3} className="input-wrapper">
                                        <Field
                                            name="responsible_person.first_name"
                                        >
                                            {({ field, form, meta }) => (
                                                <Input
                                                    label="Məsul şəxs adı"
                                                    field={field}
                                                    form={form}
                                                    meta={meta}
                                                />
                                            )}
                                        </Field>
                                    </Grid>
                                    <Grid item md={3} className="input-wrapper">
                                        <Field
                                            name="responsible_person.last_name"
                                        >
                                            {({ field, form, meta }) => (
                                                <Input
                                                    label="Məsul şəxs soyadı"
                                                    field={field}
                                                    form={form}
                                                    meta={meta}
                                                />
                                            )}
                                        </Field>
                                    </Grid>
                                    <Grid item md={3} className="input-wrapper">
                                        <Field
                                            name="responsible_person.fathers_name"
                                        >
                                            {({ field, form, meta }) => (
                                                <Input
                                                    label="Məsul şəxs ata adı"
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
                                        name="contact.mobile"
                                    >
                                        {({ field, form, meta }) => (
                                            <Input
                                                label="Telefon nömrə"
                                                field={field}
                                                form={form}
                                                meta={meta}
                                            />
                                        )}
                                    </Field>
                                </Grid>
                                <Grid item md={12} className="input-wrapper">
                                    <Field
                                        name="responsible_person.position"
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
                                        name="contact.address"
                                    >
                                        {({ field, form, meta }) => (
                                            <Input
                                                label="Ünvan"
                                                field={field}
                                                form={form}
                                                meta={meta}
                                            />
                                        )}
                                    </Field>
                                </Grid>
                                <Grid item md={12} className="input-wrapper">
                                    <Field
                                        name="contact.work_email"
                                    >
                                        {({ field, form, meta }) => (
                                            <Input
                                                label="İş e-ünvanı"
                                                field={field}
                                                form={form}
                                                meta={meta}
                                            />
                                        )}
                                    </Field>
                                </Grid>
                                <Grid item md={12} className="input-wrapper">
                                    <Field
                                        name="contact.personal_email"
                                    >
                                        {({ field, form, meta }) => (
                                            <Input
                                                label="Şəxsi e-ünvanı"
                                                field={field}
                                                form={form}
                                                meta={meta}
                                            />
                                        )}
                                    </Field>
                                </Grid>
                                <Grid item md={12} className="input-wrapper">
                                    <Field
                                        name="contact.web_site"
                                    >
                                        {({ field, form, meta }) => (
                                            <Input
                                                label="WEB sayt"
                                                field={field}
                                                form={form}
                                                meta={meta}
                                            />
                                        )}
                                    </Field>
                                </Grid>
                            </Grid>

                            <Grid item md={6} sm={12} xs={12}>
                                <Grid item md={12}>
                                        <Typography variant="h6" gutterBottom>
                                            Bank rekvizitləri
                                        </Typography>
                                    </Grid>
                                    <Divider />


                            <Grid item md={12} className="input-wrapper">
                                    <Field
                                        name="company.tin"
                                        validate={validateRequired}
                                    >
                                        {({ field, form, meta }) => (
                                            <Input
                                                label="VÖEN"
                                                field={field}
                                                form={form}
                                                meta={meta}
                                            />
                                        )}
                                    </Field>
                                </Grid>
                                <Grid item md={12} className="input-wrapper">
                                    <Field
                                        name="bank_account.account"
                                        validate={validateRequired}
                                    >
                                        {({ field, form, meta }) => (
                                            <Input
                                                label="Hesab nömrəsi"
                                                field={field}
                                                form={form}
                                                meta={meta}
                                            />
                                        )}
                                    </Field>
                                </Grid>
                                <Grid item md={12} className="input-wrapper">
                                    <Field
                                        name="bank.name"
                                        validate={validateRequired}
                                    >
                                        {({ field, form, meta }) => (
                                            <Input
                                                label="Bank adı"
                                                field={field}
                                                form={form}
                                                meta={meta}
                                            />
                                        )}
                                    </Field>
                                </Grid>
                        
                        
                                <Grid item md={12} className="input-wrapper">
                                    <Field
                                        name="bank_account.swift_no"
                                        validate={validateRequired}
                                    >
                                        {({ field, form, meta }) => (
                                            <Input
                                                label="SWIFT"
                                                field={field}
                                                form={form}
                                                meta={meta}
                                            />
                                        )}
                                    </Field>
                                </Grid>
                                <Grid item md={12} className="input-wrapper">
                                    <Field
                                        name="bank.code"
                                        validate={validateRequired}
                                    >
                                        {({ field, form, meta }) => (
                                            <Input
                                                label="Bank kodu"
                                                field={field}
                                                form={form}
                                                meta={meta}
                                            />
                                        )}
                                    </Field>
                                </Grid>
                                <Grid item md={12} className="input-wrapper">
                                    <Field
                                        name="bank.tin"
                                        validate={validateRequired}
                                    >
                                        {({ field, form, meta }) => (
                                            <Input
                                                label="Bank VÖEN"
                                                field={field}
                                                form={form}
                                                meta={meta}
                                            />
                                        )}
                                    </Field>
                                </Grid>
                                <Grid item md={12} className="input-wrapper">
                                    <Field
                                        name="bank_account.correspondent_account"
                                        validate={validateRequired}
                                    >
                                        {({ field, form, meta }) => (
                                            <Input
                                                label="Müxbir hesab"
                                                field={field}
                                                form={form}
                                                meta={meta}
                                            />
                                        )}
                                    </Field>
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