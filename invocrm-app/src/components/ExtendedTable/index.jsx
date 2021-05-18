import React, { useRef, useState, useEffect } from 'react';
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
import Chip from '@material-ui/core/Chip';
import { contractTypes, contractStatuses } from '../../constants';
import { format, parseISO } from 'date-fns'
import { InputText } from 'primereact/inputtext';

const ExtendedTable = ({ 
    entityName, data, columns, loading, 
    statuses, elRef, actions , headerTitle, onDelete, 
    enqueueSnackbar, getData,
    getItem
 }) => {

    const [globalFilter, setGlobalFilter] = useState();
    const [selectedColumns, setSelectedColumns] = useState(columns); 
    const [showDeleteModal, toggleShowDeleteModal] = useState(false);
    const [selectedRow, setSelectedRow] = useState();
    const [filters, setFilters] = useState({});


    useEffect(() => {
        let initialFilters = {};
        if (columns) {
            columns.forEach(column => {
                initialFilters[column.field] = null;
            });
        }
        setFilters(initialFilters)
    }, [columns])

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
          getData(filters)
        }, 1000)
    
        return () => clearTimeout(delayDebounceFn)
      }, [filters])

    const handleDelete = () => {
        onDelete(selectedRow)
        .then(() => {
            getData();
            toggleShowDeleteModal(false)
            setSelectedRow();
            enqueueSnackbar("Uğurla silinmişdir .", { variant: "success" }) // this row will be moved to handleRequest
        })
    }
  

    const onColumnToggle = (event) => {
        let selectedColumns = event.value;
        let orderedSelectedColumns = columns.filter(col => selectedColumns.some(sCol => sCol.field === col.field));
        setSelectedColumns(orderedSelectedColumns);
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
                            <IconButton size="small" className="edit-icon" onClick={() => getItem(rowData)}>
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
        return <Chip label={option.label} className={`status-${option.value}`} />
    }
        
    const typeItemTemplate = (option) => <span value={option.value} >{option.label}</span>

    const statusBodyTemplate = (value) => {
        const status = contractStatuses.find(contractStatus => contractStatus.value === value);
        return (
            <React.Fragment>
                <span className="p-column-title">Status</span>
                <Chip label={status.label} className={`status-${status.value}`} />
            </React.Fragment>
        );
    }


    const cellTemplate = (value, columnName, col ) => {
        if (col === "created" || col === "due_date" || col === "signature_date")
            return  (
                <React.Fragment>
                    <span className="p-column-title">{columnName}</span>
                    {value ? format(parseISO(value), "MM.dd.yyyy") : "-"}
                </React.Fragment>
            )
        return (
            <React.Fragment>
                <span className="p-column-title">{columnName}</span>
                {value}
            </React.Fragment>
        )
    }

    const typeTemplate = (value, columnName) => {
        return (
            <React.Fragment>
                <span className="p-column-title">{columnName}</span>
                {contractTypes[value]}
            </React.Fragment>
        )
    }


    const handleFilterInputChange = (filterName, filterValue) => {
        setFilters({ ... filters, [filterName]: filterValue || "" })
    }

    const columnComponents = selectedColumns.map(col => {
        
        const isDateField = col.field === "created" || col.field === "due_date" ||  col.field === "signature_date";
        const isStatusField = col.field === "status";
        const isTypeField = col.field === "contract_type" || col.field === "type";
        const dateFilter = field => <Calendar value={filters[field]}  onChange={(e) => handleFilterInputChange(field,  e.target.value ?  format(e.target.value, "yyyy-MM-dd'T'HH:mm:ss.SSS") : "")}   className="p-co.lumn-filter"  />;
        const statusFilter = field => <Dropdown value={filters[field]} options={statuses}  onChange={(e) => handleFilterInputChange(field, e.target.value)}  itemTemplate={statusItemTemplate}  className="p-column-filter" showClear />;
        const textFilter = field => <InputText onChange={(e) => handleFilterInputChange(field, e.target.value)}   value={filters[field]} />
        const typeFilter = field =>  <Dropdown value={filters[field]} options={Object.keys(contractTypes).map(type => ({ value: type, label: contractTypes[type]}))}  onChange={(e) => handleFilterInputChange(field, e.target.value)}  itemTemplate={typeItemTemplate}  className="p-column-filter" showClear />;
        const renderFilter = () => {
            if (isDateField)
                return dateFilter(col.field)
            if (isStatusField) return  statusFilter(col.field)
            if (isTypeField)  return typeFilter(col.field)
            return textFilter(col.field)
        }
        return (
            <Column
                key={col.field}
                field={col.field}
                body={(rowData) => {
                    if ( col.field === "status" )
                        return statusBodyTemplate(rowData.status);
                    if (col.field === "type" || col.field === "contract_type")
                        return typeTemplate(rowData[col.field], col.header)
                    return cellTemplate(rowData[col.field], col.header, col.field)
                }}
                filterField={col.field}
                header={col.header}
                filter={col.filter}
                filterElement={renderFilter()}
                filterPlaceholder=""
                sortable
                filterMatchMode="custom"

            />
        )
    });


    return (
        <Grid item xs={12} className="datatable-filter">
            <DataTable
                ref={elRef} 
                value={data} 
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
                        Əminsiniz ?
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