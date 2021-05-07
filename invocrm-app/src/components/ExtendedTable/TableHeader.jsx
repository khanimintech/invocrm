import React from 'react';
import { MultiSelect } from 'primereact/multiselect';
import { InputText } from 'primereact/inputtext';
import { Grid } from '@material-ui/core';

const TableHeader = ({ headerTitle, selectedColumns, columns, onColumnToggle, setGlobalFilter }) => {
    return (
        <Grid container className="table-header">
            <Grid item md={4} sm={12}>
                {headerTitle}
            </Grid>
            <Grid item md={4} sm={12}>
                <div style={{ textAlign: 'left' }}>
                    <MultiSelect selectedItemsLabel={`${selectedColumns.length} sütun seçilmişdir`} value={selectedColumns} options={columns} optionLabel="header" onChange={onColumnToggle} style={{ width: '20em' }} />
                </div>
            </Grid>
            <Grid item md={4} sm={12} className="seacrh-wrapper">
                <span className="p-input-icon-left">
                    <i className="pi pi-search" />
                    <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Cədvəl üzrə axtarış" />
                </span>
            </Grid>
    </Grid>
    )
}

export default TableHeader;