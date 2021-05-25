import React, { useEffect, useState } from 'react';
import { MultiSelect } from 'primereact/multiselect';
import { InputText } from 'primereact/inputtext';
import { Grid } from '@material-ui/core';
import { Calendar } from 'primereact/calendar';
import { format, parseISO } from 'date-fns'

const TableHeader = ({ headerTitle, selectedColumns, columns, onColumnToggle, 
    setGlobalFilter, showTimeRange, handleFilter
 }) => {

     const [from, setFrom ] = useState();
     const [to, setTo] = useState();

    useEffect(() => {
        handleFilter({from, to })
    }, [from, to])

    return (
        <Grid container className="table-header">
            <Grid item md={2} sm={12}>
                {headerTitle}
            </Grid>
            <Grid item md={2} sm={12}>
                <div style={{ textAlign: 'left' }}>
                    <MultiSelect selectedItemsLabel={`${selectedColumns.length} sütun seçilmişdir`} value={selectedColumns} options={columns} optionLabel="header" onChange={onColumnToggle} style={{ width: '20em' }} />
                </div>
            </Grid>
            <Grid item md={2} sm={12} className="seacrh-wrapper">
                <span className="p-input-icon-left">
                    <i className="pi pi-search" />
                    <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Cədvəl üzrə axtarış" />
                </span>
            </Grid>
            {
                showTimeRange ? (
                    <Grid item sm={12} md={5} className="range-wrapper">
                        <div>
                            <span for="from">Zaman aralığı: &nbsp;&nbsp;</span>
                            <Calendar id="from" value={from} onChange={(e) => setFrom( e.value ? format(e.value, "yyyy-MM-dd") : null)}  />
                            -
                            <Calendar id="to" value={to} onChange={(e) => setTo( e.value ? format(e.value, "yyyy-MM-dd") : null)} />
                        </div>
                    </Grid>
                ) : null
            }
    </Grid>
    )
}

export default TableHeader;