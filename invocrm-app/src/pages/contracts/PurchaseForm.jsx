import React, { useRef } from 'react';
import { Formik, Form, Field, FieldArray } from 'formik';
import Grid from '@material-ui/core/Grid';
import Input from '../../components/Input';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import { validateRequired } from '../../utils';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import CreateFormActions from './CreateFormActions';
import IconButton from '@material-ui/core/IconButton';
import ControlPointIcon from '@material-ui/icons/ControlPoint';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import { parseISO } from 'date-fns'

const PurchaseForm = ({ handleSubmit, handleRequest, handleClose, formType, selectedContract, salesManagers, banks }) => {
    let formikRef = useRef();
    const {
        created, due_date, id, sales_manager, type , company,
        po_number, supplements
    } = selectedContract || {};

    
    return (
        <>
        <DialogContent className="create-contract-wrapper">
          <DialogContentText>
            <Formik
                initialValues={{ 
                    id,
                    po_number: po_number || "",
                    due_date: due_date? parseISO(due_date) : new Date(),
                    created: created ? parseISO(created)  : new Date(),
                    sales_manager: sales_manager,
                    company,
                    supplements: supplements && supplements.length ? supplements.map(s => ({ ...s, id: undefined})) : [{}],
                }}
                onSubmit={handleSubmit}
                innerRef={form => (formikRef = form)}
                >

                {({ values }) => (
                    <Form>
                        <Grid container spacing={0} justify="space-between" spacing={5}>
                            <Grid item md={12} sm={12} xs={12}>
                                <Grid item md={12}>
                                    <Typography variant="h6" gutterBottom>
                                        Ümumi məlumatlar
                                    </Typography>
                                </Grid>
                                <Divider />
                                <Grid item md={12} className="input-wrapper">
                                    <Field
                                        validate={validateRequired}
                                        name="po_number"
                                    >
                                        {({ field, form, meta }) => (
                                            <Input
                                                label="PO nömrəsi"
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
                                        name="company.name"
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
                                <Grid container spacing={0} >
                                    <FieldArray
                                        validate={validateRequired}
                                        name="supplements"
                                        render={arrayHelpers => (
                                            <>
                                              {values.supplements.map((val, index) => (
                                                  <Grid container spacing={0}>
                                                    <Grid item className="input-wrapper" md={11} key={index}>
                                                    <Field
                                                            validate={validateRequired}
                                                            name={`supplements[${index}].supplement_no`}
                                                        >
                                                            {({ field, form, meta }) => (
                                                                <>
                                                                <Input
                                                                    label="Supplement NO"
                                                                    field={field}
                                                                    form={form}
                                                                    meta={meta}
                                                                />
                                                                </>
                                                            )}
                                                        </Field>
                                                    </Grid>
                                                    {
                                                        ( index === values.supplements.length - 1 ? (
                                                                <Grid item md={1} className="icon-wrapper align-center" >
                                                                    <IconButton   onClick={() => arrayHelpers.push({ supplement_no: ''})}  size="small">
                                                                        <ControlPointIcon fontSize="default" color="primary" />
                                                                    </IconButton>
                                                                </Grid>
                                                            ) :(
                                                            <Grid item md={1} className="icon-wrapper align-center">
                                                                <IconButton  onClick={() => arrayHelpers.remove(index)} size="small">
                                                                    <HighlightOffIcon fontSize="default" color="error" />
                                                                </IconButton>
                                                            </Grid>
                                                            )
                                                            )}
                                                  </Grid>
                                              ))}
                                            </>
                                          )}
                                />
                                </Grid>
                            </Grid>
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


export default PurchaseForm;