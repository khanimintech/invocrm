import React, { useRef } from 'react';
import { Formik, Form, Field } from 'formik';
import Grid from '@material-ui/core/Grid';
import Input from '../../../components/Input';
import { ContractsService } from '../../../services/ContractsService';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import { validateRequired } from '../../../utils';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
// import CreateFormActions from './CreateFormActions';
// import CustomerContacts from './CustomerContacts';
// import { contractTypes, companyTypes } from './../../../constants';
import { format, parseISO } from 'date-fns'
import { contractTypes } from '../../../constants';
import CreateFormActions from '../CreateFormActions';
import CreateAnnex from '../CreateAnnex';


const SalesForm = ({ handleSubmit, contract, sellers, handleClose, units }) => {
	let formikRef = useRef();

	return (
		<>
			<DialogContent>
				<DialogContentText>
					<Formik
						initialValues={{
							products: [
								{
									name: "",
									quantity: 0,
									unit: 0,
									price: 0,
									total: 0,
									id: 1,
								}
							]
						}}
						onSubmit={handleSubmit}
						innerRef={form => (formikRef = form)}
						enableReinitialize
					>

						{({ values }) => (
							<Form>
								<Grid container  justify="space-between" >
									<Grid item md={12} sm={12} xs={12}>
										<Typography variant="subtitle1" gutterBottom>
											Ümumi məlumatlar
                      					</Typography>
										<Divider />
										<Grid container>
											<Grid item md={6}>
												<Typography variant="subtitle1" gutterBottom>
													{`Şirkət/Müştəri: ${contract.company_name}`}
												</Typography>
												<Typography variant="subtitle1" gutterBottom>
													{`Müqavilə Növü: ${contractTypes[contract.type]}`}
												</Typography>
												<Typography variant="subtitle1" gutterBottom>
													{`Müqavilə №: ${contract.contract_no}`}
												</Typography>
											</Grid>
											<Grid item md={6}>
												<Typography variant="subtitle1" gutterBottom>
													{`Tarix : ${contract.created ? format(parseISO(contract.created), "MM.dd.yyyy") : "-"}`}
												</Typography>
												<Typography variant="subtitle1" gutterBottom>
													{`Əlavə № : ${contract.annex_count + 1}`}
												</Typography>
											</Grid>
										</Grid>
										<Grid container justify="space-between" >
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
											<Grid item md={6} sm={12} xs={12} className="input-wrapper">
												<Field
													name="note"
												>
													{({ field, form, meta }) => (
														<Input
															label="Qeyd"
															field={field}
															form={form}
															meta={meta}
															multiline
															rows={2}
														/>
													)}
												</Field>
											</Grid>
											<Grid container spacing={0}>
											<Grid item md={6} sm={12} xs={12} className="input-wrapper">
												<Field
													name="request_no"
													validate={validateRequired}
												>
													{({ field, form, meta }) => (
														<Input
															label="Sorğu №"
															field={field}
															form={form}
															meta={meta}
														/>
													)}
												</Field>
											</Grid>
											<Grid item md={6} sm={12} xs={12} className="input-wrapper">
												<Field
													name="payment_terms"
													validate={validateRequired}
												>
													{({ field, form, meta }) => (
														<Input
															label="Ödəniş şərti"
															field={field}
															form={form}
															meta={meta}
														/>
													)}
												</Field>
											</Grid>
											</Grid>
											<Grid container>
											<Grid item md={6} sm={12} xs={12} className="input-wrapper">
												<Field
													name="delivery_terms"
													validate={validateRequired}
												>
													{({ field, form, meta }) => (
														<Input
															label="Çatdırılma şərti"
															field={field}
															form={form}
															meta={meta}
														/>
													)}
												</Field>
											</Grid>
											<Grid item md={6} sm={12} xs={12} className="input-wrapper">
												<Field
													name="acquisition_terms"
													validate={validateRequired}
												>
													{({ field, form, meta }) => (
														<Input
															label="Məhsulun təhvili"
															field={field}
															form={form}
															meta={meta}
														/>
													)}
												</Field>
											</Grid>
											</Grid>
											<Grid container>
												<Grid item md={6} sm={12} xs={12} className="input-wrapper">
													<Field
														name="seller"
														validate={validateRequired}
													>
														{({ field, form, meta }) => (
															<Input
																label="Satıcı"
																field={field}
																form={form}
																meta={meta}
																options={sellers}
																select
															/>
														)}
													</Field>
												</Grid>
											</Grid>
											<Divider />
											<Grid item md={12}>
												<CreateAnnex products={values.products} units={units} type={1} />
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


export default SalesForm;