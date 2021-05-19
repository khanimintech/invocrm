import React, { useState, useEffect, useRef } from 'react';
import { Formik, Form, Field, FieldArray } from 'formik';
import Grid from '@material-ui/core/Grid';
import Input from '../../components/Input';
import { ContractsService } from '../../services/ContractsService';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import { validateRequired } from '../../utils';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import CreateFormActions from './CreateFormActions';
import IconButton from '@material-ui/core/IconButton';
import ControlPointIcon from '@material-ui/icons/ControlPoint';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';

const PurchaseForm = ({ handleSubmit, handleRequest, handleClose, formType, selectedContract, read }) => {
    let formikRef = useRef();
    const {contract_no, annex_count, company_name, 
        created, due_date, id, sales_manager_id, type ,
    } = selectedContract || {};

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
                    id,
                    due_date: due_date || new Date(),
                    created: created || new Date(),
                    contract_no,
                    sales_manager: sales_manager_id,
                    company: {
                        name: company_name,
                        type,
                    },
                    supplements: [{}],
                }}
                onSubmit={vals => handleSubmit({ ...vals})}
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
                                                readOnly={id} 
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
                                                                    readOnly={id} 
                                                                />
                                                                </>
                                                            )}
                                                        </Field>
                                                    </Grid>
                                                    {
                                                            id ? null : ( index === values.supplements.length - 1 ? (
                                                                <Grid item md={1} className="icon-wrapper align-center" >
                                                                    <IconButton   onClick={() => arrayHelpers.push({ supple_no: ''})}  size="small">
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
        {
            id? null : (
                <CreateFormActions handleClose={handleClose} handleSave={() => formikRef.submitForm()} />
            )
        }
        
    </>
    )
}


export default PurchaseForm;