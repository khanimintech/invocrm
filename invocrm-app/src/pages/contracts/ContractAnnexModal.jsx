import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import SalesForm from './createAnnex/SalesForm';
import AgentForm from './createAnnex/AgentForm';
import RentForm from './createAnnex/RentForm';
import CircularProgress from '@material-ui/core/CircularProgress';


const formTypes = {
    1: <SalesForm />,
    2: <SalesForm />,
    3: <SalesForm />,
    4: <AgentForm />,
    5: <RentForm />,
    7: <SalesForm hideAnnexTable/>,
    8: <SalesForm />,
    9: <SalesForm hideAnnexTable/>,
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
    reloadData,
    modalLoading,
    annexType,
    selectedAnnex
}) => {

    return (
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
        <DialogTitle id="form-dialog-title">Müqaviləyə əlavə</DialogTitle>
        {  modalLoading ? <div className="spinner-wrapper"><CircularProgress /></div>  : (
            <div className="create-annex-form">
                {  formType ?
                    React.cloneElement( formTypes[formType], {
                        handleSubmit: (vals, formikBag) => {
                            handleSubmit({
                                ...vals, 
                                ...(annexType ? (isSalesType( annexType) && vals.total ? {products: []} : {} ) : {
                                    contract: contract ? contract.id : undefined,
                                    ...(isSalesType(contract.type) && vals.total ? {products: []} : {} ),
                                }),
                                type: contract ? contract.type : undefined, 
                                contract_id: contract ? contract.id : undefined,
                                ...( contract && contract.type === 4  && vals.total? {agent_items: []} : {} ),
                                ...( contract && contract.type === 5  && vals.total ? {rent_items: []} : {} ),
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
                        units,
                        selectedAnnex
                        })
                    : null
                }
            </div>
        )}
      </Dialog>
    )
}



export default ContractAnnexModal;