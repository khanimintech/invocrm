import React, { useState, useRef, useEffect } from 'react';
import PageContent from '../../components/PageContainer';
import DescriptionIcon from '@material-ui/icons/Description';
import PriorityHighIcon from '@material-ui/icons/PriorityHigh';
import AccessAlarmIcon from '@material-ui/icons/AccessAlarm';
import HourglassEmptyIcon from '@material-ui/icons/HourglassEmpty';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import { MultiSelect } from 'primereact/multiselect';
import AttachFileIcon from '@material-ui/icons/AttachFile';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import Tooltip from '@material-ui/core/Tooltip';
import { ContractsService } from '../../services/ContractsService';
import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/Add';
import { Grid } from '@material-ui/core';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import PostAddIcon from '@material-ui/icons/PostAdd';

import './styles.scss';


const initialOverviews = [
    { id: 1, status: "Vaxti bitən", count: 0, icon: <PriorityHighIcon />, color: "#42A5F5" },
    { id: 2, status: "Vaxti bitmeyine 2 hefte qalan", count: 0, icon: <AccessAlarmIcon />, color: "#7E57C2" },
    { id: 3, status: "Prosesdə", count: 0, icon: <HourglassEmptyIcon />, color: "#FFB300" },
    { id: 4, status: "Təsdiqlənib", count: 0, icon: <CheckCircleIcon />, color: "#66BB6A" },
]

const columns = [
    { field: 'company_name', header: 'Şirkət' },
    { field: 'contract_id', header: 'Müqavilə Nömrəsi' },
    { field: 'type', header: 'Müqavilə Növü' },
    { field: 'created', header: 'Yaradılma Tarixi' },
    { field: 'end_date', header: "Bitmə Tarixi" },
    { field: 'sales_name', header: "Satış Meneceri" },
    { field: 'status', header: 'Status' },
    { field: 'executor', header: "İcraçı" },
    { field: 'annex_count', header: "Elave sayi" },

];

const ITEM_HEIGHT = 48;

const Contracts = ({ handleRequest, user, loading }) => {
    let dt = useRef(null);

    const [overviews, setOverviews] = useState(initialOverviews);
    const [contracts, setContracts] = useState(null);
    const [selectedDate, setSelectedDate] = useState();
    const [selectedStatus, setSelectedStatus] = useState();
    const [globalFilter, setGlobalFilter] = useState();
    const [statuses, setStatuses] = useState([]);
    const [selectedColumns, setSelectedColumns] = useState(columns);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const openCreateMenu = Boolean(anchorEl);



    useEffect(() => {
        getContracts();
    }, [])


    useEffect(() => {
        if (contracts && contracts.length)
            setStatuses(contracts.map(contract => contract.status))
    }, [contracts]);



    const getContracts = () => {
        handleRequest(
            ContractsService.index()
        ).then(res => {
            setContracts(res.body.data)
        })
    }


    const filterDate = (value, filter) => {
        if (filter === undefined || filter === null || (typeof filter === 'string' && filter.trim() === '')) {
            return true;
        }

        if (value === undefined || value === null) {
            return false;
        }

        return value === formatDate(filter);
    }

    const formatDate = (date) => {
        let month = date.getMonth() + 1;
        let day = date.getDate();

        if (month < 10) {
            month = '0' + month;
        }

        if (day < 10) {
            day = '0' + day;
        }

        return date.getFullYear() + '-' + month + '-' + day;
    }


    const onDateChange = (e) => {
        dt.filter(e.value, 'date', 'custom');
        setSelectedDate(e.value)
    }

    const onStatusChange = (e) => {
        dt.filter(e.value, 'status', 'equals');
        setSelectedStatus(e.value)
    }

    const onColumnToggle = (event) => {
        let selectedColumns = event.value;
        let orderedSelectedColumns = columns.filter(col => selectedColumns.some(sCol => sCol.field === col.field));
        setSelectedColumns(orderedSelectedColumns);
    }

    const exportCSV = () => {
        dt.current.exportCSV();
    }

    const actionsBodyTemplate = () => {
        return (
            <div className="table-actions-row">
                <Tooltip title="Elave yarat" placement="top">
                    <IconButton size="small">
                        <AddIcon />
                    </IconButton>
                </Tooltip>
                <Tooltip title="Muqavileni goster" placement="top">
                    <IconButton size="small">
                        <AttachFileIcon />
                    </IconButton>
                </Tooltip>
                <Tooltip title="Duzelish et" placement="top">
                    <IconButton size="small">
                        <EditIcon />
                    </IconButton>
                </Tooltip>
                <Tooltip title="Muqavileni sil" placement="top">
                    <IconButton size="small">
                        <DeleteIcon />
                    </IconButton>
                </Tooltip>

            </div>

        )
    }


    const statusBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <span className="p-column-title">Status</span>
                <span className={`customer-badge status-${rowData.status}`}>{rowData.status}</span>
            </React.Fragment>
        );
    }


    const statusItemTemplate = (option) => {
        return <span className={`customer-badge status-${option}`}>{option}</span>;
    }

    const cellTemplate = (value, columnName) => {
        return (
            <React.Fragment>
                <span className="p-column-title">{columnName}</span>
                {value}
            </React.Fragment>
        )
    }




    const header = (
        <Grid container className="table-header">
            <Grid item md={4} sm={12}>
                Muqavilelerinn siyahisi
            </Grid>
            <Grid item md={4} sm={12}>
                <div style={{ textAlign: 'left' }}>
                    <MultiSelect selectedItemsLabel={`${selectedColumns.length} sutun secilmishdir`} value={selectedColumns} options={columns} optionLabel="header" onChange={onColumnToggle} style={{ width: '20em' }} />
                </div>
            </Grid>
            <Grid item md={4} sm={12} className="seacrh-wrapper">
                <span className="p-input-icon-left">
                    <i className="pi pi-search" />
                    <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Sehife uzre axtarish" />
                </span>
            </Grid>


        </Grid>
    );

    const dateFilter = <Calendar value={selectedDate} onChange={onDateChange} dateFormat="yy-mm-dd" className="p-column-filter" placeholder="Registration Date" />;
    const statusFilter = <Dropdown value={selectedStatus} options={statuses} onChange={onStatusChange} itemTemplate={statusItemTemplate} placeholder="Select a Status" className="p-column-filter" showClear />;

    const columnComponents = selectedColumns.map(col => {
        const isDateField = col.field === "created" || col.field === "end_date";
        const isStatusField = col.field === "status";
        return (
            <Column
                key={col.field}
                field={col.field}
                body={(rowData) => {
                    console.log(rowData.field)
                    return col.field === "status" ? statusBodyTemplate(rowData) : cellTemplate(rowData[col.field], col.header)
                }}
                filterField={col.field}
                header={col.header}
                filter
                filterFunction={isDateField ? filterDate : null}
                filterElement={isDateField ? dateFilter : (isStatusField ? statusFilter : null)}
                filterPlaceholder=""
                filterMatchMode={isDateField ? "gte" : "contains"}
                sortable

            />
        )
    });

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
                    <PostAddIcon fontSize="medium" />
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

                <MenuItem onClick={event => setAnchorEl(event.currentTarget)}>
                    Alqı-satqı
                </MenuItem>
                <MenuItem onClick={event => setAnchorEl(event.currentTarget)}>
                    Xidmət
                </MenuItem>
                <MenuItem onClick={event => setAnchorEl(event.currentTarget)}>
                    Agent
                </MenuItem>
                <MenuItem onClick={event => setAnchorEl(event.currentTarget)}>
                    Distribyutor
                </MenuItem>
            </Menu>
        </>
    )

    return (
        <PageContent
            title="Müqavilələr"
            titleIcon={<DescriptionIcon />}
            overviewCards={overviews}
            sum={contracts ? contracts.length : 0}
            onExportCSV={exportCSV}
            addIcon={addIcon}
        >
            <Grid item xs={12} className="datatable-filter">
                <DataTable
                    ref={dt} value={contracts} rows={10}
                    header={header} className="p-datatable p-datatable-responsive p-datatable-gridlines"
                    loading={loading} globalFilter={globalFilter} emptyMessage="Hec bir muqavile tapilmadi">
                    {columnComponents}
                    <Column header={"Emeliyyatlar"} body={actionsBodyTemplate} />
                </DataTable>
            </Grid>


        </PageContent>
    )
}


export default Contracts;