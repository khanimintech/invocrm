import React, { useRef } from 'react';
import { Formik, Form, Field } from 'formik';
import Grid from '@material-ui/core/Grid';
import Input from '../../../components/Input';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import { validateRequired } from '../../../utils';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import CreateFormActions from '../CreateFormActions';
import CreateAnnex from '../CreateAnnex';


const AgentForm = ({ handleSubmit, contract, handleClose, salesManagers }) => {
    let formikRef = useRef();
    return (
        <>
			<DialogContent>
				<DialogContentText>
					<Formik
						initialValues={{
							agent_items : [
								{
									id: 1,
								}
							]
						}}
						onSubmit={ handleSubmit}
						innerRef={form => (formikRef = form)}
						enableReinitialize
					>

						{({ values }) => (
							<Form>
								<Grid container spacing={0} justify="space-between" spacing={5}>
									<Grid item md={12} sm={12} xs={12}>
										<Typography variant="subtitle1" gutterBottom>
											Ümumi məlumatlar
                                        </Typography>
										<Divider />
										<Grid container spacing={0}>
											<Grid item md={6}>
												<Typography variant="subtitle1" gutterBottom>
													{`Müqavilə №: ${contract.contract_no}`}
												</Typography>
                                                <Typography variant="subtitle1" gutterBottom>
													{`Əlavə №: ${contract.annex_count + 1}`}
												</Typography>
                                                <Typography variant="subtitle1" gutterBottom>
													{`Agent: ${contract.executor_name}`}
												</Typography>
											</Grid>
                                            <Grid item md={6} sm={12} xs={12}  className="input-wrapper">
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
										</Grid>
                                        <Divider />
                                        <br />
										<Grid container spacing={0} justify="space-between" spacing={5}>
											<Grid item md={12} type="agent">
												<CreateAnnex products={values.agent_items} productsFieldName="agent_items" type={4} total={values.total || 0} />
											</Grid>
										</Grid>
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



export default AgentForm;