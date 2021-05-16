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
import { companyTypes } from '../../constants';
import BankRequisits from './BankRequisits';
import CustomerContacts from './CustomerContacts';


const CompanyOneTimeForm = ({salesManagers}) => {
    return (
        <>
            <Grid item md={12} className="input-wrapper">
                                            <Field
                                                validate={validateRequired}
                                                name="contract_no"
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
                                                            validate={validateRequired}
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
                                                            validate={validateRequired}
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
                                                            validate={validateRequired}
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
                                                validate={validateRequired}
                                                name="contract_no"
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
                                                validate={validateRequired}
                                                name="contract_no"
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
                                                validate={validateRequired}
                                                name="contract_no"
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
                                                            name="executor.first_name"
                                                            validate={validateRequired}
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
                                                            name="executor.last_name"
                                                            validate={validateRequired}
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
                                                            name="executor.fathers_name"
                                                            validate={validateRequired}
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
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                        
                                        <Grid item md={12} className="input-wrapper">
                                            <Field
                                                validate={validateRequired}
                                                name="contract_no"
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
                                                name="sales_manager"
                                                validate={validateRequired}
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
                                                name="sales_manager"
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
                                                name="sales_manager"
                                                validate={validateRequired}
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
                                                name="sales_manager"
                                                validate={validateRequired}
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
                                                name="sales_manager"
                                                validate={validateRequired}
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
                                                name="sales_manager"
                                                validate={validateRequired}
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
                                                name="sales_manager"
                                                validate={validateRequired}
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
                                                name="sales_manager"
                                                validate={validateRequired}
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
                                                name="sales_manager"
                                                validate={validateRequired}
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
                                                name="sales_manager"
                                                validate={validateRequired}
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
                                                name="sales_manager"
                                                validate={validateRequired}
                                            >
                                                {({ field, form, meta }) => (
                                                    <Input
                                                        label="Standart "
                                                        field={field}
                                                        form={form}
                                                        meta={meta}
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
                                                        label="Yaradılma tarixi"
                                                        field={field}
                                                        form={form}
                                                        meta={meta}
                                                        date
                                                    />
                                                )}
                                            </Field>
                                        </Grid>
        </>
    )
}


export default CompanyOneTimeForm;