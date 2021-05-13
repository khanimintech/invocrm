import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import SalesForm from './SalesForm';
import { ContractsService } from '../../services/ContractsService';

const formTypes = {
    "sales": {
        label: "Alqı-satqı",
        component: <SalesForm />,
    }
}



const CreateContractModal = ({open, formType, handleRequest, handleClose, enqueueSnackbar, reloadData }) => {

  const handleSubmit = vals => {
    handleRequest(
      ContractsService.save(vals)
    )
    .then(() => {
      reloadData()
      handleClose();
      enqueueSnackbar("Əməliyyat uğurla tamamlandı.", { variant: "success"});
    })
  }

    return (
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xl">
        <DialogTitle id="form-dialog-title">{formType ? formTypes[formType].label: ""}</DialogTitle>
        {  formType ?
               React.cloneElement( formTypes[formType].component, {
                 handleSubmit,
                 handleRequest,
                 handleClose

                })
             : null
           }
      </Dialog>
    )
}


export default CreateContractModal;