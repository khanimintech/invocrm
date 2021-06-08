import React from 'react';
import { Field } from 'formik';
import Grid from '@material-ui/core/Grid';
import Input from '../../components/Input';
import { validateRequired } from '../../utils';


const CompanyOneTimeForm = ({ salesManagers, id  }) => {
    return (
        <>
            <Grid item md={12} className="input-wrapper">
                <Field
                    validate={validateRequired}
                    name="company.name"
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
                                name= "executor.fathers_name"
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
                    name="company.tin"
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
                    name={!id ? "executor_contact.mobile" : "executor.contact.mobile"}
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
                    name={!id ? "executor_contact.personal_email" : "executor.contact.personal_email"}
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
                                name="annex.seller.first_name"
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
                                name="annex.seller.last_name"
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
                                name="annex.seller.fathers_name"
                                validate={validateRequired}
                            >
                                {({ field, form, meta }) => (
                                    <Input
                                        label="Satıcı ata adı"
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
                    name="annex.seller.position"
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
            <Grid item md={12} className="input-wrapper">
                <Field
                    validate={validateRequired}
                    name="annex.request_no"
                >
                    {({ field, form, meta }) => (
                        <Input
                            label="Sorğu NO"
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
                    name="final_amount_with_writing"
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
                    name="annex.payment_terms"
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
                    name="annex.acquisition_terms"
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
                    name="annex.delivery_terms"
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
                    name="price_offer"
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
                    name="price_offer_validity"
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
                    name="warranty_period"
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
                    name="unpaid_period"
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
                    name="unpaid_value"
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
                    name="part_acquisition"
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
                    name="part_payment"
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
                    name="standard"
                    validate={validateRequired}
                >
                    {({ field, form, meta }) => (
                        <Input
                            label="Standart"
                            field={field}
                            form={form}
                            meta={meta}
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
        </>
    )
}


export default CompanyOneTimeForm;