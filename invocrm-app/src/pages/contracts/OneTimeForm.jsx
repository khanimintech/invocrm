import React, { useState, useRef } from 'react';
import { Formik, Form } from 'formik';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import CreateFormActions from './CreateFormActions';
import CustomerContacts from './CustomerContacts';
import CompnayOneTimeForm from './CompanyOneTimeForm';
import CreateAnnex from './CreateAnnex';
import TextField from '@material-ui/core/TextField';
import PhysicalOneTimeForm from './PhysicalOneTimeForm';
import MenuItem from '@material-ui/core/MenuItem';
import { parseISO } from 'date-fns'

const OneTimeForm = ({handleRequest, handleSubmit, handleClose, selectedContract, units, salesManagers  }) => {
    let formikRef = useRef();
    const {contract_no, annex_count, company_name, 
        created, due_date, id, sales_manager_id, type ,
    } = selectedContract || {};

    const [contractType, setContractType ] = useState(1);


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
                            sales_manager: sales_manager_id,
                            ...( contractType  === 1 ? { company: {
                                name: company_name,
                                type,
                            }} : {} ),
                            products: [{
                                name: "",
                                quantity: 0,
                                unit: 0,
                                price: "",
                                total: 0,
                                id: 1,
                            }]
                        }}
                        onSubmit={vals => handleSubmit({ ...vals })}
                        innerRef={form => (formikRef = form)}
                        enableReinitialize
                    >

                        {({ values }) => (
                            <Form>
                                <Grid container spacing={0} justify="space-between" spacing={5}>
                                    <Grid item md={6} sm={12} xs={12}>
                                        <Grid item md={12}>
                                            <Typography variant="h6" gutterBottom>
                                                Ümumi məlumatlar
                                            </Typography>
                                            <TextField
                                                select
                                                fullWidth
                                                label="Növü"
                                                value={type}
                                                onChange={e => setContractType(e.target.value)}
                                                variant="outlined"
                                                >
                  
                                                <MenuItem  value={1}>
                                                    Hüquqi
                                                </MenuItem>
                                                <MenuItem value={2}>
                                                    Fiziki
                                                </MenuItem>
               
                                                </TextField>
                                        </Grid>
                                        <Divider />
                                            {
                                                contractType === 1 ? <CompnayOneTimeForm salesManagers={salesManagers} readOnly={id}/> : <PhysicalOneTimeForm   salesManagers={salesManagers} readOnly={id} />
                                            }
                                            
                                        <CustomerContacts  />
                                    </Grid>
                                    <Grid item md={6}>
                                        <CreateAnnex products={values.products} units={units} readOnly={id} type={1} />
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


export default OneTimeForm;