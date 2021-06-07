import React from 'react';
import { Field } from 'formik';
import Grid from '@material-ui/core/Grid';
import Input from '../../components/Input';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';



const CustomerContacts = ({ readOnly , values}) => {

    const {responsible_person, contact} = values || {}; 
    const {last_name, first_name, position, fathers_name } = responsible_person ||  {};
    const {mobile, personal_email, web_site, work_email, address} = contact || {};


    return (
        <>
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
                        validate={(val) => {
                            if (!val)
                                return  last_name || fathers_name ||  mobile || position || 
                                    address || work_email || personal_email 
                                    || web_site ? "Bu sahə mütləqdir" : null
                        }}
                    >
                        {({ field, form, meta }) => (
                            <Input
                                label="Məsul şəxs adı"
                                field={field}
                                form={form}
                                meta={meta}
                                readOnly={readOnly}
                            />
                        )}
                    </Field>
                </Grid>
                <Grid item md={3} className="input-wrapper">
                    <Field
                        name="responsible_person.last_name"
                        validate={(val) => {
                            if (!val)
                                return  first_name || fathers_name || mobile || position || 
                                    address || work_email || personal_email 
                                    || web_site ? "Bu sahə mütləqdir" : null
                        }}
                    >
                        {({ field, form, meta }) => (
                            <Input
                                label="Məsul şəxs soyadı"
                                field={field}
                                form={form}
                                meta={meta}
                                readOnly={readOnly}
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
                                readOnly={readOnly}
                                onChange={val => {
                                    form.setFieldValue(field.name, val)
                                    if (!val){
                                        form.setErrors({ 'responsible_person.last_name'  :  null})
                                        form.setErrors({ 'responsible_person.first_name'  :  null})                                    }
                                }}
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
                            readOnly={readOnly}
                            onChange={val => {
                                form.setFieldValue(field.name, val)
                                if (!val){
                                    form.setErrors({ 'responsible_person.last_name'  :  null})
                                    form.setErrors({ 'responsible_person.first_name'  :  null})                                    }
                            }}
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
                            readOnly={readOnly}
                            onChange={val => {
                                form.setFieldValue(field.name, val)
                                if (!val){
                                    form.setErrors({ 'responsible_person.last_name'  :  null})
                                    form.setErrors({ 'responsible_person.first_name'  :  null})                                    }
                            }}
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
                            readOnly={readOnly}
                            onChange={val => {
                                form.setFieldValue(field.name, val)
                                if (!val){
                                    form.setErrors({ 'responsible_person.last_name'  :  null})
                                    form.setErrors({ 'responsible_person.first_name'  :  null})                                    }
                            }}
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
                            readOnly={readOnly}
                            onChange={val => {
                                form.setFieldValue(field.name, val)
                                if (!val){
                                    form.setErrors({ 'responsible_person.last_name'  :  null})
                                    form.setErrors({ 'responsible_person.first_name'  :  null})                                    }
                            }}
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
                            readOnly={readOnly}
                            onChange={val => {
                                form.setFieldValue(field.name, val)
                                if (!val){
                                    form.setErrors({ 'responsible_person.last_name'  :  null})
                                    form.setErrors({ 'responsible_person.first_name'  :  null})                                    }
                            }}
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
                            readOnly={readOnly}
                            onChange={val => {
                                form.setFieldValue(field.name, val)
                                if (!val){
                                    form.setErrors({ 'responsible_person.last_name'  :  null})
                                    form.setErrors({ 'responsible_person.first_name'  :  null})                                    }
                            }}
                        />
                    )}
                </Field>
            </Grid>
        </>
    )
}

export default CustomerContacts;