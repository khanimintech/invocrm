import React  from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import SalesForm from './SalesForm';
import { ContractsService } from '../../services/ContractsService';
import { contractTypes } from '../../constants';
import PurchaseForm from './PurchaseForm';
import InternationalForm from './InternationalForm';
import AgentForm from './AgentForm';
import OneTimeForm from './OneTimeForm';
import CircularProgress from '@material-ui/core/CircularProgress';


const formTypes = {
    1: <SalesForm />,
    2: <SalesForm />,
    3: <SalesForm formType={3} />,
    4: <AgentForm />,
    5: <SalesForm />,
    6: <OneTimeForm />,
    7: <PurchaseForm />,
    8: <InternationalForm />,
    9: <SalesForm  formType={9} />
}



const CreateContractModal = ({open, formType, handleRequest, handleClose, enqueueSnackbar, reloadData, selectedContract, units, salesManagers, banks, modalLoading  }) => {

  const handleSubmit = (vals, formikBag ) => {
    handleRequest(
      ContractsService.save({...vals, type: +formType, annex: { ...vals.annex, products: (+formType === 6 && vals.annex.total && !vals.annex.products[0].name) ? [] : vals.annex.products} })
    )
    .then(() => {
      reloadData()
      handleClose();
      enqueueSnackbar("Əməliyyat uğurla tamamlandı.", { variant: "success"});
    })
    .catch(err => {
      if (err.statusCode === 400)
        formikBag.setErrors(err.body)
    })
  }

    return (
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth={+formType === 7  ? "md" :"xl"}>
        <DialogTitle id="form-dialog-title">{formType ?  contractTypes[formType] : ""}</DialogTitle>
        {  modalLoading ? <div className="spinner-wrapper"><CircularProgress /></div>  : 
           (formType ?
               React.cloneElement( formTypes[formType], {
                 handleSubmit,
                 handleRequest,
                 handleClose,
                 selectedContract,
                 units,
                 salesManagers,
                 banks
                })
             : null)
           }
      </Dialog>
    )
}


export default CreateContractModal;