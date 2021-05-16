import React  from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import SalesForm from './SalesForm';
import { ContractsService } from '../../services/ContractsService';
import { contractTypes } from '../../constants';

const formTypes = {
    1: <SalesForm />
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
        <DialogTitle id="form-dialog-title">{formType ?  contractTypes[formType] : ""}</DialogTitle>
        {  formType ?
               React.cloneElement( formTypes[formType], {
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