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


const AgentForm = ({ handleSubmit, contract, handleClose, salesManagers, selectedAnnex }) => {
	let formikRef = useRef();
	return (
		<>
			<DialogContent>
				<DialogContentText>
					<Formik
						initialValues={{
							...selectedAnnex,
							status: selectedAnnex && selectedAnnex.status ? selectedAnnex.status : 0,
							agent_items: selectedAnnex && selectedAnnex.agent_items && selectedAnnex.agent_items.length ? selectedAnnex.agent_items : [
								{
									client_name: "",
								},
							],
							total: null,
						}}
						onSubmit={handleSubmit}
						innerRef={form => (formikRef = form)}
						enableReinitialize
					>

						{({ values }) => (
							<Form>
								<Grid container justify="space-between" >
									<Grid item md={12} sm={12} xs={12}>
										{
											contract ? (
												<>
													<Typography variant="subtitle1" gutterBottom>
														Ümumi məlumatlar
												</Typography>
													<Divider />
												</>
											) : null
										}
										<Grid container spacing={0}>
											{
												contract ? (
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
												) : null
											}
											<Grid item md={6} sm={12} xs={12} className="input-wrapper">
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
										<Grid container spacing={0}>
											<Grid item md={6} className="input-wrapper">
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
											<Grid item md={6} className="input-wrapper">
												<Field
													name="status"
													validate={validateRequired}
												>
													{({ field, form, meta }) => (
														<Input
															label="Status"
															field={field}
															form={form}
															meta={meta}
															select
															options={[
																{ value: 0, label: "Prosesdə" },
																{ value: 1, label: "Təsdiqlənib" },
																{ value: 2, label: "Ləğv edilib" }
															]}
														/>
													)}
												</Field>
											</Grid>
											{
												selectedAnnex ? (
													<Grid container>
													<Grid item md={6} className="input-wrapper">
														<Field
															name="revision"
															validate={validateRequired}
														>
															{({ field, form, meta }) => (
																<Input
																	label="Reviziya"
																	field={field}
																	form={form}
																	meta={meta}
																	checkbox
																/>
															)}
														</Field>
													</Grid>
													</Grid>

												): null
											}
										</Grid>
										<Divider />
										<br />
										<Grid container spacing={0} justify="space-between" >
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