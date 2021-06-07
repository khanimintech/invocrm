import React, { useRef, useState } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import CustomerContacts from '../contracts/CustomerContacts';
import CreateFormActions from '../contracts/CreateFormActions';
import { Formik, Form } from 'formik';
import { ContactsService } from '../../services/ContactsService';

const CreateContactModal = ({open, handleClose, handleRequest, reloadData }) => {
    let formikRef = useRef();
    const [disabled, setDisabled] = useState(true);

    const handleSubmit = (vals) => {
        handleRequest(
            ContactsService.save(vals)
        )
        .then(() => {
            reloadData();
            handleClose();
        })
    }



    return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
        <DialogContent>
                <Formik
                        initialValues={{
                            responsible_person: {
                                first_name: "",
                                last_name: "",
                                fathers_name: "",
                                position: "",    
                            },
                            contact: {
                                mobile: "",
                                address: "",
                                work_email: "",
                                personal_email: "",
                                web_site: ""
                            }

                        }}
                        onSubmit={handleSubmit}
                        innerRef={form => (formikRef = form)}
                        validate={(vals) => {
                            const formValues = { ...vals.contact, ...vals.responsible_person };
                            if (Object.values(formValues).join("").length){
                                setDisabled(false)
                                return null
                            }
                            setDisabled(true)
                            return true
                        } }
                    >

                        {({ values }) => (
                            <Form>
                                <CustomerContacts />
                            </Form>
                        )}
                    </Formik>
            </DialogContent>
            <CreateFormActions handleClose={handleClose} handleSave={() => formikRef.submitForm()} disabled={disabled} />

    
        </Dialog>
    )
}


export default CreateContactModal;