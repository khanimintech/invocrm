import React from 'react';
import { Field } from 'formik';
import Grid from '@material-ui/core/Grid';
import Input from '../../components/Input';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';



const CustomerContacts = ({ readOnly, type, values }) => {

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
                            />
                        )}
                    </Field>
                </Grid>
            </Grid>
            <Grid item md={12} className="input-wrapper">
                <Field
                    name={ type ? "mobile": "contact.mobile"}
                >
                    {({ field, form, meta }) => (
                        <Input
                            label="Telefon nömrə"
                            field={field}
                            form={form}
                            meta={meta}
                            readOnly={readOnly}
                        />
                    )}
                </Field>
            </Grid>
            {
              values.custom ? (
                <Grid item md={12} className="input-wrapper">
                <Field
                    name="company_name"
                >
                    {({ field, form, meta }) => (
                        <Input
                            label="Şirkət adı"
                            field={field}
                            form={form}
                            meta={meta}
                        />
                    )}
                </Field>
            </Grid>
              ) : null
            }
           
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
                        />
                    )}
                </Field>
            </Grid>
            <Grid item md={12} className="input-wrapper">
                <Field
                    name={ type ? "address": "contact.address"}
                >
                    {({ field, form, meta }) => (
                        <Input
                            label="Ünvan"
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
                    name={type ? "work_email" : "contact.work_email"}
                >
                    {({ field, form, meta }) => (
                        <Input
                            label="İş e-ünvanı"
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
                    name={type ? "personal_email":"contact.personal_email"}
                >
                    {({ field, form, meta }) => (
                        <Input
                            label="Şəxsi e-ünvanı"
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
                    name={type ? "web_site": "contact.web_site"}
                >
                    {({ field, form, meta }) => (
                        <Input
                            label="WEB sayt"
                            field={field}
                            form={form}
                            meta={meta}
                            readOnly={readOnly}
                        />
                    )}
                </Field>
            </Grid>
        </>
    )
}

export default CustomerContacts;