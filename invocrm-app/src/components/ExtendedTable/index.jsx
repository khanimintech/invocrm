import React, { useRef, useState } from 'react';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import AttachFileIcon from '@material-ui/icons/AttachFile';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import AddIcon from '@material-ui/icons/Add';
import TableHeader from '../../components/ExtendedTable/TableHeader';
import { Grid } from '@material-ui/core';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';


const ExtendedTable = ({ 
    entityName, data, columns, loading, 
    statuses, elRef, actions , headerTitle, onDelete, 
    enqueueSnackbar, getData
 }) => {
    let dt = useRef(null);

    const [selectedDate, setSelectedDate] = useState();
    const [selectedStatus, setSelectedStatus] = useState();
    const [globalFilter, setGlobalFilter] = useState();
    const [selectedColumns, setSelectedColumns] = useState(columns); 
    const [showDeleteModal, toggleShowDeleteModal] = useState(false);
    const [selectedRow, setSelectedRow] = useState();

    const handleDelete = () => {
        onDelete(selectedRow)
        .then(() => {
            getData();
            toggleShowDeleteModal(false)
            setSelectedRow();
            enqueueSnackbar("Uğurla silinmişdir .", { variant: "success" }) // this row will be moved to handleRequest
        })
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

    const filterDate = (value, filter) => {
        if (filter === undefined || filter === null || (typeof filter === 'string' && filter.trim() === '')) {
            return true;
        }

        if (value === undefined || value === null) {
            return false;
        }

        return value === formatDate(filter);
    }

    const closeDeleteModal = () => toggleShowDeleteModal(false)

    const handleDeleteClick = (rowData) => {
        setSelectedRow(rowData)
        toggleShowDeleteModal(true);
    }



    const header = (
        <TableHeader
            headerTitle={headerTitle}
            selectedColumns={selectedColumns}
            columns={columns}
            onColumnToggle={onColumnToggle}
            setGlobalFilter={setGlobalFilter}
        />
    );

    const actionsBodyTemplate = (rowData) => {
        return (
            <div className="table-actions-row">
                {
                    actions.plus ? (
                        <Tooltip title="Yenisin yarat" placement="top">
                        <IconButton size="small" className="add-icon">
                            <AddIcon />
                        </IconButton>
                    </Tooltip>
                    ): null
                }
               {
                   actions.attach  ?(
                        <Tooltip title="Bax" placement="top">
                        <IconButton size="small" className="attach-icon">
                            <AttachFileIcon />
                        </IconButton>
                    </Tooltip>
                   ): null
               }
                {
                    actions.edit ? (
                        <Tooltip title="Redaktə et" placement="top">
                            <IconButton size="small" className="edit-icon">
                                <EditIcon />
                            </IconButton>
                        </Tooltip>
                    ): null
                }
                {
                    actions.delete ? (
                        <Tooltip title="Sil" placement="top">
                    <IconButton size="small" onClick={()=> handleDeleteClick(rowData)} className="delete-icon">
                        <DeleteIcon />
                    </IconButton>
                </Tooltip>
                    ): null
                }
                
            </div>
        )
    }

    const statusItemTemplate = (option) => {
        return <span className={`customer-badge status-${option}`}>{option}</span>;
    }
        

    const statusBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <span className="p-column-title">Status</span>
                <span className={`customer-badge status-${rowData.status}`}>{rowData.status}</span>
            </React.Fragment>
        );
    }


    const cellTemplate = (value, columnName) => {
        return (
            <React.Fragment>
                <span className="p-column-title">{columnName}</span>
                {value}
            </React.Fragment>
        )
    }



    const columnComponents = selectedColumns.map(col => {
        
        const isDateField = col.field === "created" || col.field === "end_date";
        const isStatusField = col.field === "status";

        const dateFilter = <Calendar value={selectedDate} onChange={onDateChange} dateFormat="yy-mm-dd" className="p-column-filter" placeholder="Registration Date" />;
        const statusFilter = <Dropdown value={selectedStatus} options={statuses} onChange={onStatusChange} itemTemplate={statusItemTemplate} placeholder="Select a Status" className="p-column-filter" showClear />;

        return (
            <Column
                key={col.field}
                field={col.field}
                body={(rowData) => {
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


    return (
        <Grid item xs={12} className="datatable-filter">
            <DataTable
                ref={elRef} 
                value={data} 
                rows={10}
                header={header} 
                className="p-datatable p-datatable-responsive p-datatable-gridlines"
                loading={loading} 
                globalFilter={globalFilter} 
                emptyMessage="Heç bir məlumat tapılmadı.">
                {columnComponents}
                <Column header={"Əmaliyyatlar"} 
                    body={actionsBodyTemplate}
                />
            </DataTable>
            <Dialog
                    open={showDeleteModal}
                    onClose={closeDeleteModal}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">{selectedRow && selectedRow.name}</DialogTitle>
                    <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Bu sənədi silmək istədiyinizə əminsiniz ?
                    </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                    <Button onClick={handleDelete} color="primary">
                        Sil
                    </Button>
                    <Button onClick={closeDeleteModal}  autoFocus>
                        Ləğv et
                    </Button>
                    </DialogActions>
                </Dialog>
    </Grid>
    )
}


export default ExtendedTable;