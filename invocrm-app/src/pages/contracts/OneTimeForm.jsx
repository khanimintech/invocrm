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
import TextField from '@material-ui/core/TextField';
import PhysicalOneTimeForm from './PhysicalOneTimeForm';
import MenuItem from '@material-ui/core/MenuItem';

const OneTimeForm = ({handleRequest, handleSubmit, handleClose, selectedContract }) => {
    let formikRef = useRef();
    const {contract_no, annex_count, company_name, 
        created, due_date, id, sales_manager_id, type ,
    } = selectedContract || {};
    const [salesManagers, setSalesManagers] = useState([]);
    const [units, setUnits] = useState([]);
    const [contractType, setContractType ] = useState(1);

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
                            id,
                            due_date: due_date || new Date(),
                            created: created || new Date(),
                            contract_no,
                            sales_manager: sales_manager_id,
                            company: {
                                name: company_name,
                                type,
                            },
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
                                        <CreateAnnex products={values.products} units={units} readOnly={id} />
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