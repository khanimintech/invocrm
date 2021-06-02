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

const OneTimeForm = ({ handleSubmit, handleClose, selectedContract, units, salesManagers }) => {
    let formikRef = useRef();
    const { contract_no, company,
        created, due_date, id, sales_manager, type,
        executor, final_amount_with_writing, part_acquisition,
        part_payment, price_offer, price_offer_validity, standard, unpaid_period, unpaid_value,
        warranty_period, annex
    } = selectedContract || {};

    const [contractType, setContractType] = useState(selectedContract ? (selectedContract.company ? 1 : 2) : 1);

    return (
        <>
            <DialogContent className="create-contract-wrapper">
                <Formik
                    initialValues={{
                        id,
                        due_date: due_date ? parseISO(due_date) : new Date(),
                        created: created ? parseISO(created) : new Date(),
                        contract_no,
                        executor,
                        part_payment,
                        final_amount_with_writing,
                        part_acquisition,
                        price_offer,
                        standard,
                        price_offer_validity,
                        unpaid_period,
                        unpaid_value,
                        warranty_period,
                        sales_manager,
                        annex: {
                            ...annex,
                            products: annex && annex.products ? annex.products : [{
                                name: "",
                                quantity: 0,
                                unit: 0,
                                price: "",
                                total: 0,

                                index: 1,
                            }]
                        },
                        ...(contractType === 1 ? { company } : {}),

                    }}
                    onSubmit={handleSubmit}
                    innerRef={form => (formikRef = form)}
                >

                    {({ values, setErrors }) => (
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
                                            value={contractType}
                                            onChange={e => setContractType(e.target.value)}
                                            variant="outlined"
                                        >

                                            <MenuItem value={1}>
                                                Hüquqi
                                                </MenuItem>
                                            <MenuItem value={2}>
                                                Fiziki
                                                </MenuItem>

                                        </TextField>
                                    </Grid>
                                    <Divider />
                                    {
                                        contractType === 1 ? <CompnayOneTimeForm salesManagers={salesManagers} readOnly={id} /> : <PhysicalOneTimeForm salesManagers={salesManagers} readOnly={id} />
                                    }

                                    <CustomerContacts values={values} setErrors={setErrors} />
                                </Grid>
                                <Grid item md={6}>
                                    <CreateAnnex products={values.annex.products} units={units} type={1} productsFieldName="annex.products"/>
                                </Grid>
                            </Grid>
                        </Form>
                    )}
                </Formik>
            </DialogContent>
            <CreateFormActions handleClose={handleClose} id={id} handleSave={() => formikRef.submitForm()} />
        </>
    )
}


export default OneTimeForm;