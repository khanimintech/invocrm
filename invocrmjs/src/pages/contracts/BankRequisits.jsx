import React from 'react';
import { Field } from 'formik';
import Grid from '@material-ui/core/Grid';
import Input from '../../components/Input';
import { validateRequired } from '../../utils';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';

const BankRequisits = ({ hideTin, readOnly, type , banks }) => {
    return (
        <Grid item md={6} sm={12} xs={12}>
        <Grid item md={12}>
            <Typography variant="h6" gutterBottom>
                Bank rekvizitləri
        </Typography>
        </Grid>
        <Divider />


        <Grid item md={12} className="input-wrapper">
            <Field
                name={ type === 4 ? "executor.tin" : "company.tin"}
                validate={validateRequired}
            >
                {({ field, form, meta }) => (
                    <Input
                        label="VÖEN"
                        field={field}
                        form={form}
                        meta={meta}
                        readOnly={readOnly}
                        autoComplete
                        hideTin={hideTin}
                        renderOption={(bank) => {
                            return <div>
                              <b >{`VÖEN: ${bank.value || "NA"}`}</b>
                                <br/>
                             <span className="autocomplete-subtext">{`Bank adı: ${bank.name}`}</span>
                             <br/>
                             <span className="autocomplete-subtext">{`Hesab: ${bank.account}`}</span>
                            </div>
                        }}
                        options={banks.map(bank => ({ value: bank.company_tin, label: bank.company_tin || "NA",  ...bank }))}
                        onChange={(e, bank) => {
                            form.setFieldValue(type === 4 ? "executor.tin" : "company.tin", bank.value )
                        }}
                        onInputchange={(e, bank) => {
                            form.setFieldValue(type === 4 ? "executor.tin" : "company.tin", bank.value )
                        }}
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
                        readOnly={readOnly}
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
                        readOnly={readOnly}
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
                        readOnly={readOnly}
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
                        readOnly={readOnly}
                    />
                )}
            </Field>
        </Grid>
        {
            hideTin ? null : (
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
                                readOnly={readOnly}
                            />
                        )}
                    </Field>
                </Grid>
            )
        }
       
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
                        readOnly={readOnly}
                    />
                )}
            </Field>
        </Grid>
    </Grid>
    )
}


export default BankRequisits;