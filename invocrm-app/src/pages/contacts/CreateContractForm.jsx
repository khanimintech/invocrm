import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import SalesForm from './SalesForm';


const formTypes = {
    "sales": {
        label: "Alqı-satqı",
        component: <SalesForm />,
    }
}



const CreateContractModal = ({open, handleClose, formType}) => {


    return (
        <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">{formTypes[formType].label}</DialogTitle>
        <DialogContent>
          <DialogContentText>
           {
               formTypes[formType].component
           }
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleClose} color="primary">
            Subscribe
          </Button>
        </DialogActions>
      </Dialog>
    )
}


export default CreateContractModal;