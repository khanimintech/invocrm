import React, { useState, useRef, useEffect } from 'react';
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
import html2canvas from 'html2canvas';
import CreateContractModal from './CreateContractForm';
import { contractStatuses } from '../../constants';
import ContractAnnexModal from './ContractAnnexModal';
import { AnnexesService } from '../../services/AnnexesService';
import { BanksService }from '../../services/BanksService';
import Attachments from './Attachments';


import './styles.scss';


const initialOverviews = [
    { id: 2, status: "Vaxtı bitən", count: 0, icon: <PriorityHighIcon />, color: "#42A5F5" },
    { id: 3, status: "Vaxtı bitir", count: 0, icon: <AccessAlarmIcon />, color: "rgb(90 89 204)" },
    { id: 0, status: "Prosesdə", count: 0, icon: <HourglassEmptyIcon />, color: "#FFB300" },
    { id: 1, status: "Təsdiqlənib", count: 0, icon: <CheckCircleIcon />, color: "#66BB6A" },
]

const columns = [
    { field: 'company_name', header: 'Şirkət', filter: true },
    { field: 'contract_no', header: 'Müqavilə Nömrəsi', filter: true, showDetails: true },
    { field: 'type', header: 'Müqavilə Növü',  filter: true },
    { field: 'created', header: 'Yaradılma Tarixi', filter: true },
    { field: 'due_date', header: "Bitmə Tarixi", filter: true },
    { field: 'sales_manager', header: "Satış Meneceri", filter: true },
    { field: 'status', header: 'Status', filter: true },
    { field: 'annex_count', header: "Elavə sayi", filter: false, add: true },
];




const Contracts = ({ handleRequest, user, loading, enqueueSnackbar }) => {

    let dt = useRef(null);
    let dtW = useRef(null);
    const [overviews, setOverviews] = useState(initialOverviews);
    const [contracts, setContracts] = useState(null);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [showCreateModal, toggleShowCreateModal] = useState(false);
    const [contractType, setContractType] = useState();
    const [selectedContract, setSelectedContract] = useState();
    const [annexModal, toggleAnnexModal] = useState();
    const [salesManagers, setSalesManagers] = useState([]);
    const [sellers, setSellers] = useState([]);
    const [units, setUnits] = useState([]);
    const [banks, setBanks] = useState([]);
    const [attachmentsSidebar, toggleAttachmentsSidebar] = useState(false);
    const [filters, setFilters] = useState({});
    const [tableLoading, toggleLoading] = useState(false);
    const [allCount, setAllCount] = useState(0);
    const [modalLoading, toggleModalLoading] = useState(false);
    const [selectedContractForAttachment, setSelectedContractForAttachment] = useState();
    const openCreateMenu = Boolean(anchorEl);

    useEffect(() => {
        getSalesManagers()
        getSellers()
        getUnits();
        getBanks();
    }, [])


    useEffect(() => {
        getOverviews();
    }, [filters.contract_created_after, filters.contract_created_before])

    const getBanks = () => {
        handleRequest(
            BanksService.index()
        ).then(res => setBanks(res.body))
    }


    const getUnits = () => {
        handleRequest(
            AnnexesService.getUnits()
        ).then((res) => {
            if (res.body)
                setUnits(res.body)
        })
    }

    const getSalesManagers = () => {
        handleRequest(
            ContractsService.getSalesManagers()
        )
        .then(res => setSalesManagers(res.body.map(salesManager => ({ value: salesManager.id, label: salesManager.fullname }))))
    }

    const getSellers = () => {
        handleRequest(
            ContractsService.getSellers()
        )
        .then(res => setSellers(res.body.map(seller => ({ value: seller.id, label: seller.fullname }))))
    }


    const getContracts = (filters) => {
        toggleLoading(true)
        return handleRequest(
            ContractsService.index(filters)
        ).then(res => {
            if (res.body){
                setContracts(res.body);
            }
        })
        .finally(() => toggleLoading(false))
    }

    const getContract = contract => {
        toggleModalLoading(true)
        handleRequest(ContractsService.getItem(contract.id))
        .then(({ body }) => {
            setContractType(body.type);
            toggleShowCreateModal(true);
            setSelectedContract(body)
            toggleModalLoading(false)
        })
    }

    const getOverviews = () => {
        handleRequest(
            ContractsService.getStateCounts({ contract_created_after: filters.contract_created_after, contract_created_before: filters.contract_created_before})
        ).then(res => {
            if (res.body) {
                const updatedOverviews = overviews.map( o => {
                    if (o.id === 0) return { ...o, count: res.body.in_process_count}
                    if (o.id === 1) return { ...o, count: res.body.approved_count}
                    if (o.id === 2) return { ...o, count: res.body.expired_count}
                    if (o.id === 3) return { ...o, count: res.body.expires_in_2_weeks}
                })
                setOverviews(updatedOverviews)
                setAllCount(res.body.all_count)
            }
        })
    }

    const deleteContract = (contract) =>  handleRequest(ContractsService.remove(contract.id));

    const handleOpenContractModal =  contractType => {
        setContractType(contractType);
        toggleShowCreateModal(true);
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


    const handleAdd = (contract) =>{
        setContractType(contract.type);
        setSelectedContract(contract);
        toggleAnnexModal(true)
    }

    const handleAddAnenx = vals => {
        return handleRequest(
            ContractsService.createAnnex({...vals, request_no: vals.request_no || null})
        )
    }


    const handleAttachmentClick = (contract) => {
        setSelectedContractForAttachment(contract)
        toggleAttachmentsSidebar(true);
    }


    return (
        <PageContent
            title="Müqavilələr"
            titleIcon={<DescriptionIcon />}
            overviewCards={overviews}
            sum={allCount}
            onExportCSV={() => dt.current.exportCSV()}
            addIcon={addIcon}
            data={contracts}
            columns={columns}
            showTimeRange
            handleFilter={({from, to}) =>  {
                setFilters({ ...filters, "contract_created_after": from , "contract_created_before" : to })
            }}
            table={ <ExtendedTable
                data={contracts}
                columns={columns}
                statuses={contractStatuses}

            />}
        >
            <ExtendedTable
                headerTitle="Müqavilələrin siyahısı"
                data={contracts}
                columns={columns}
                statuses={contractStatuses}
                elRef={dt}
                actions={{ edit: false, delete: true, attach: true, plus: false, show: true}}
                enqueueSnackbar={enqueueSnackbar}
                onDelete={deleteContract}
                getData={getContracts}
                getItem={getContract}
                addItem={handleAdd}
                onAttachmentClick={handleAttachmentClick}
                filters={filters}
                setFilters={setFilters}
                tableLoading={tableLoading}
            />
            <CreateContractModal
                open={showCreateModal}
                handleClose={() => {
                    toggleShowCreateModal(false);
                    setSelectedContract();
                    setContractType();
                }}
                formType={contractType}
                handleRequest={handleRequest}
                enqueueSnackbar={enqueueSnackbar}
                reloadData={() => {
                    getContracts(filters)
                    getBanks();
                }}
                selectedContract={selectedContract}
                units={units}
                salesManagers={salesManagers}
                banks={banks}
                modalLoading={modalLoading}
            />{
                annexModal ? (
                    <ContractAnnexModal
                        open={true}
                        handleClose={() => {
                            toggleAnnexModal(false)
                            setSelectedContract(null)
                        }}
                        handleSubmit={handleAddAnenx}
                        handleRequest={handleRequest}
                        formType={contractType}
                        salesManagers={salesManagers}
                        contract={selectedContract}
                        sellers={sellers}
                        units={units}
                        reloadData={getContracts}
                    />
                ) : null
            }
            <Attachments
                open={attachmentsSidebar}
                setOpen={toggleAttachmentsSidebar} 
                contract={selectedContractForAttachment}
                handleOpenContractClick={() => getContract(selectedContractForAttachment) }
                handleRequest={handleRequest}
                enqueueSnackbar={enqueueSnackbar}
            />
        </PageContent>
    )
}


export default Contracts;