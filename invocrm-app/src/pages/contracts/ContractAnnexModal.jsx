import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import SalesForm from './createAnnex/SalesForm';
import AgentForm from './createAnnex/AgentForm';
import RentForm from './createAnnex/RentForm';



const formTypes = {
    1: <SalesForm />,
    2: <SalesForm />,
    3: <SalesForm />,
    4: <AgentForm />,
    5: <RentForm />,
    8: <SalesForm />,
}

const isSalesType = contractType => contractType === 1 ||contractType === 2 ||  contractType  ===  3  || contractType  === 8 ? true : false 

const ContractAnnexModal = ({
    open,
    handleClose,
    handleRequest,
    handleSubmit,
    formType,
    salesManagers,
    contract,
    sellers,
    units,
    reloadData
}) => {
    return (
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
        <DialogTitle id="form-dialog-title">Müqaviləyə əlavə</DialogTitle>
        <div className="create-annex-form">
            {  formType ?
                React.cloneElement( formTypes[formType], {
                    handleSubmit: (vals, formikBag) => {
                        handleSubmit({
                            ...vals, 
                            type: contract.type, 
                            contract: contract.id, 
                            contract_id: contract.id,
                            ...(isSalesType( contract.type) && vals.total ? {products: []} : {} ),
                            ...( contract.type === 4 ? {agent_items: []} : {} ),
                            ...( contract.type === 5 ? {rent_items: []} : {} ),
                            })
                        .then(() => {
                            reloadData();
                            handleClose();
                        })
                        .catch(({ statusCode, body }) => {
                            if (statusCode == 400) {
                                Object.keys(body).forEach(field => {
                                    formikBag.setErrors({ [field]: body[field]})
                                })
                            }
                        })
                        
                    },
                    handleRequest,
                    handleClose,
                    salesManagers,
                    contract,
                    sellers,
                    units
                    })
                : null
            }
        </div>
      </Dialog>
    )
}



export default ContractAnnexModal;