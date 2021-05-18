import React, { useState, useEffect, useRef } from 'react';
import { Formik, Form, Field } from 'formik';
import Grid from '@material-ui/core/Grid';
import Input from '../../components/Input';
import { ContractsService } from '../../services/ContractsService';
import { AnnexesService } from '../../services/AnnexesService';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import { validateRequired } from '../../utils';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import CreateFormActions from './CreateFormActions';
import { companyTypes } from './../../constants';
import BankRequisits from './BankRequisits';
import CustomerContacts from './CustomerContacts';
import CompnayOneTimeForm from './CompanyOneTimeForm';
import CreateAnnex from './CreateAnnex';

const OneTimeForm = ({handleRequest, handleSubmit, handleClose }) => {
    let formikRef = useRef();

    const [salesManagers, setSalesManagers] = useState([]);
    const [units, setUnits] = useState([]);

    useEffect(() => {
        getSalesManagers();
        getUnits();
    }, [])

    const getUnits = () => {
        handleRequest(
            AnnexesService.getUnits()
        ).then((res) => {
            if (res.body)
                setUnits(res.body)
        })
    }


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
                            products: [{
                                name: "",
                                quantity: 0,
                                unit: 0,
                                price: "",
                                total: 0,
                                id: 0,
                            }]
                        }}
                        onSubmit={vals => handleSubmit({ ...vals })}
                        innerRef={form => (formikRef = form)}
                    >

                        {({ values }) => (
                            <Form>
                                <Grid container spacing={0} justify="space-between" spacing={5}>
                                    <Grid item md={6} sm={12} xs={12}>
                                        <Grid item md={12}>
                                            <Typography variant="h6" gutterBottom>
                                                Ümumi məlumatlar
                                    </Typography>
                                        </Grid>
                                        <Divider />
                                        
                                            <CompnayOneTimeForm salesManagers={salesManagers}/>

                                        <CustomerContacts  />
                                    </Grid>
                                    <Grid item md={6}>
                                        <CreateAnnex products={values.products} units={units} />
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


export default OneTimeForm;