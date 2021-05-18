import React, { useState, useRef } from 'react';
import PageContent from '../../components/PageContainer';
import DescriptionIcon from '@material-ui/icons/Description';
import PriorityHighIcon from '@material-ui/icons/PriorityHigh';
import AccessAlarmIcon from '@material-ui/icons/AccessAlarm';
import HourglassEmptyIcon from '@material-ui/icons/HourglassEmpty';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import { ContractsService } from '../../services/ContractsService';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import PostAddIcon from '@material-ui/icons/PostAdd';
import ExtendedTable from '../../components/ExtendedTable';
import { contractTypes, ITEM_HEIGHT } from '../../constants';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import CreateContractModal from './CreateContractForm';
import { contractStatuses } from '../../constants';

import './styles.scss';


const initialOverviews = [
    { id: 2, status: "Vaxtı bitən", count: 0, icon: <PriorityHighIcon />, color: "#42A5F5" },
    { id: 3, status: "Vaxtı bitir", count: 0, icon: <AccessAlarmIcon />, color: "#7E57C2" },
    { id: 0, status: "Prosesdə", count: 0, icon: <HourglassEmptyIcon />, color: "#FFB300" },
    { id: 1, status: "Təsdiqlənib", count: 0, icon: <CheckCircleIcon />, color: "#66BB6A" },
]

const columns = [
    { field: 'company_name', header: 'Şirkət', filter: true },
    { field: 'contract_no', header: 'Müqavilə Nömrəsi', filter: true },
    { field: 'type', header: 'Müqavilə Növü',  filter: true },
    { field: 'created', header: 'Yaradılma Tarixi', filter: true },
    { field: 'due_date', header: "Bitmə Tarixi", filter: true },
    { field: 'sales_manager', header: "Satış Meneceri", filter: true },
    { field: 'status', header: 'Status', filter: true },
    { field: 'annex_count', header: "Elave sayi", filter: false },
];




const Contracts = ({ handleRequest, user, loading, enqueueSnackbar }) => {

    let dt = useRef(null);
    
    const [overviews, setOverviews] = useState(initialOverviews);
    const [contracts, setContracts] = useState(null);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [showCreateModal, toggleShowCreateModal] = useState(false);
    const [contractType, setContractType] = useState();
    const openCreateMenu = Boolean(anchorEl);


    const getContracts = (filters) => {
        handleRequest(
            ContractsService.index(filters)
        ).then(res => {
            if (res.body){
                setContracts(res.body);
                const ended = res.body.filter(c => c.status === 2)
                const inProcess = res.body.filter(c => c.status === 0)
                const approved = res.body.filter(c => c.status === 1)
                const twoWeeks = res.body.filter(c => c.status === 3)
                const updatedOverviews = overviews.map( o => {
                    if (o.id === 0) return { ...o, count: inProcess? inProcess.length : 0}
                    if (o.id === 1) return { ...o, count: approved? approved.length : 0}
                    if (o.id === 2) return { ...o, count: ended? ended.length : 0}
                    if (o.id === 3) return { ...o, count: twoWeeks? twoWeeks.length : 0}
                })
                setOverviews(updatedOverviews)
            }
        })
    }

    const deleteContract = (contract) => handleRequest(ContractsService.remove(contract.id));

    const exportPDF = () => {
        const el = document.getElementsByClassName("p-datatable-wrapper")[0].cloneNode(true);
        html2canvas(el)
        .then((canvas) => {
            let img = new Image();
            img.src = canvas.toDataURL('image/png');
            img.onload = function () {
              let pdf = new jsPDF({
                orientation: "landscape",
                unit: "in",
                format: [8, 4]
              });
              pdf.addImage(img, 0, 0, pdf.internal.pageSize.width, pdf.internal.pageSize.height);
              pdf.save('contracts.pdf');
            };
        })
    }

    const handleOpenContractModal =  contractType => {
        toggleShowCreateModal(true);
        setContractType(contractType);
        setAnchorEl(null)
    }


    const addIcon = (
        <>
            <Tooltip title="Sened yarat" placement="top-end">
                <IconButton
                    aria-label="elave"
                    aria-controls="long-menu"
                    aria-haspopup="true"
                    onClick={event => setAnchorEl(event.currentTarget)}
                    className="add-icon"
                >
                    <PostAddIcon />
                </IconButton>
            </Tooltip>

            <Menu
                id="long-menu"
                anchorEl={anchorEl}
                keepMounted
                open={openCreateMenu}
                onClose={() => setAnchorEl(null)}
                PaperProps={{
                    style: {
                        maxHeight: ITEM_HEIGHT * 4.5,
                        width: '20ch',
                    },
                }}
            >
                {
                    Object.keys(contractTypes).map(contractTypeId => (
                        <MenuItem onClick={() => handleOpenContractModal(contractTypeId)} key={contractTypeId}>
                            {contractTypes[contractTypeId]}
                        </MenuItem>
                    ))
                }
            </Menu>
        </>
    )



    return (
        <PageContent
            title="Müqavilələr"
            titleIcon={<DescriptionIcon />}
            overviewCards={overviews}
            sum={contracts ? contracts.length : 0}
            onExportCSV={() => dt.current.exportCSV()}
            addIcon={addIcon}
            onExportPDF={exportPDF}
        >
            <ExtendedTable
                headerTitle="Müqavilələrin siyahısı"
                data={contracts}
                loading={loading}
                columns={columns}
                statuses={contractStatuses}
                elRef={dt}
                actions={{ edit: true, delete: true, attach: true, plus: true}}
                enqueueSnackbar={enqueueSnackbar}
                onDelete={deleteContract}
                getData={getContracts}
            />
            <CreateContractModal
                open={showCreateModal}
                handleClose={() => toggleShowCreateModal(false)}
                formType={contractType}
                handleRequest={handleRequest}
                enqueueSnackbar={enqueueSnackbar}
                reloadData={getContracts}
            />
        </PageContent>
    )
}


export default Contracts;