import React, { useState, useEffect } from 'react';
import Drawer from '@material-ui/core/Drawer';
import { contractTypes } from '../../constants';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { ContractsService } from '../../services/ContractsService';
import CircularProgress from '@material-ui/core/CircularProgress';
import DescriptionIcon from '@material-ui/icons/Description';
import { format, parseISO } from 'date-fns';
import { Divider } from '@material-ui/core';
import GetAppIcon from '@material-ui/icons/GetApp';
import ClearIcon from '@material-ui/icons/Clear';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';

const Files = ({ files, onDelete }) => {
    return (
        files.map( file => (
            <div className="file-row" key={file.id}>
                <div  className="clickable-column" onClick={() => window.open(file.url, "_blank")}>
                    <DescriptionIcon  className="upload-icon"/>
                    <span>{file.name}</span>
                </div>
                <div>
                    <span>{ format(parseISO(file.created), 'MM/dd/yyyy')}</span>
                    <Tooltip title="Sil" placement="top">
                        <IconButton size="small" color="secondary" className="clear-icon" onClick={() => onDelete(file)}>
                            <ClearIcon />
                        </IconButton>
                    </Tooltip>
                </div>
            </div>
        ))
    )
}

const Attachments = ({ open, setOpen, contract, handleOpenContractClick, handleRequest, enqueueSnackbar }) => {
    const [activeTab, setActiveTab] = React.useState(2);
    const [attachments, setAttachments] = useState({annexes: [], contracts: [], other: []});
    const [loading, toggleLoading] = useState(false)

    useEffect(() => {
        if (contract) {
            getAttachments();
        }
    }, [contract])

    const getAttachments = () => {
        toggleLoading(true);
        handleRequest(
            ContractsService.getAttachments(contract.id),
            true
        )
            .then(res => {
                setAttachments(res.body || { contracts: [], annexes: [], other: [] });
            })
            .finally(() => toggleLoading(false))
    }

    const handleUploadAttahcment = file => {
        const type = activeTab === 1 ? "contract" : activeTab === 2 ?  "annex" : "other";
        const formData = new FormData();
        formData.append("attachment", file);

        handleRequest(ContractsService.uploadAttachment(type, formData, contract.id))
        .then(res => {
            enqueueSnackbar("Fayl u??urla ??lav?? edildi", { variant : "success"})
            getAttachments()
        })
    }


    const handleDelete = file => {
        const type = activeTab === 1 ? "contract" : activeTab === 2 ?  "annex" : "other";
        handleRequest(
            ContractsService.deleteAttachment (type, contract.id, file.id)
        ).then(() => {
            enqueueSnackbar("Fayl u??urla silindi", { variant : "success"})
            getAttachments()
        })
    }


    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
    };



    return (
        <Drawer open={open} onClose={() => setOpen(false)} anchor="right" variant="temporary" className="attachments-sidebar">
            {
                contract ? (
                    <>
                        <div className="contract-header">
                            <div>{contract.company_name}</div>
                            <div>{contractTypes[contract.type]}</div>
                            <div className="clickable-column" onClick={handleOpenContractClick}>{contract.contract_no || "NA"}</div>
                        </div>
                        <Tabs
                            value={activeTab}
                            indicatorColor="primary"
                            textColor="primary"
                            onChange={handleTabChange}
                            aria-label="disabled tabs example"
                        >
                            <Tab label="M??qavil??" value={1} />
                            <Tab label="??lav??" value={2} />
                            <Tab label="Ba??qa" value={3} />
                        </Tabs>
                        {
                            loading ? <CircularProgress  className="spinner" color="primary"/> : <>
                                <Files 
                                    files={activeTab === 1 ?  attachments.contracts : activeTab === 2 ?  attachments.annexes : attachments.other }
                                    onDelete={file => handleDelete(file)}
                                />
                                <Divider />
                                <div className="upload-row">
                                    <GetAppIcon  color="primary" />
                                    <span className="clickable-column upload-link" onClick={() => document.getElementById("file").click()} >Fayl y??kl??yin</span>
                                </div>
                                <input type="file" id="file"  className="hidden-input" onChange={e => handleUploadAttahcment(e.target.files[0])} />
                                </>
            
                        }
                    </>
                ) : null
            }
      
        </Drawer>



    )
}


export default Attachments;