import React, { useState, useRef, useEffect } from 'react';
import PageContent from '../../components/PageContainer';
import PriorityHighIcon from '@material-ui/icons/PriorityHigh';
import AccessAlarmIcon from '@material-ui/icons/AccessAlarm';
import AttachFileIcon from '@material-ui/icons/AttachFile';
import { AnnexesService } from '../../services/AnnexesService';
import ExtendedTable from '../../components/ExtendedTable';


const initialOverviews = [
    { id: 1, status: "ƏDV-siz", count: 0, icon: <PriorityHighIcon />, color: "#42A5F5", width: 3 },
    { id: 2, status: "ƏDV-li", count: 0, icon: <AccessAlarmIcon />, color: "rgb(90 89 204)", width: 3 },
]

const columns = [
    { field: 'company_name', header: 'Şirkət', filter: true },
    { field: 'request_no', header: 'Sorğu №', filter: true  },
    { field: 'contract_no', header: 'Müqavilə Nömrəsi' , filter: true },
    { field: 'contract_type', header: 'Müqavilə Növü' , filter: true },
    { field: 'annex_no', header: 'Əlavə №' , filter: true },
    { field: 'sales_manager', header: "Satış Meneceri" , filter: true },
    // { field: '1', header: "Məhsul", filter: true  },
    { field: 'payment_terms', header: "Ödəniş şərti" , filter: true },
    { field: 'sum_no_invoice', header: "Məbləğ (ƏDV-siz)" , filter: false },
    { field: 'sum_with_invoice', header: "Məbləğ (ƏDV-li)" , filter: false },
     { field: 'created', header: 'Yaradılma Tarixi', filter: true  },
];


const Annexes = ({ handleRequest, user, loading, enqueueSnackbar }) => {
    let dt = useRef(null);

    const [overviews, setOverviews] = useState(initialOverviews);
    const [annexes, setAnnexes] = useState(null);
    const [filters, setFilters] = useState({});
    const [tableLoading, toggleLoading] = useState(false);
    const [allCount, setAllCount] = useState(0);

    useEffect(() => {
        getOverviews();
    }, [filters.annex_created_after, filters.annex_created_before])


    const getAnnexes = (filters) => {
        toggleLoading(true)
        return handleRequest(
            AnnexesService.index(filters)
        ).then(res => {
            if (res.body){
                toggleLoading(false)
                setAnnexes(res.body)
            }

            
        })
    }


    const getOverviews = () => {
        handleRequest(
            AnnexesService.getStateCounts({ annex_created_after: filters.annex_created_after, annex_created_before: filters.annex_created_before})
        ).then(res => {
            if (res.body) {
                const updatedOverviews = overviews.map( o => {
                    if (o.id === 1) return { ...o, count: res.body.vat_free}
                    if (o.id === 2) return { ...o, count: res.body.with_vat}
                    if (o.id === 3) return { ...o, count: res.all_count}
                })
                setOverviews(updatedOverviews)
                setAllCount(res.body.all_count)
            }
        })
    }


    return (
        <PageContent
            title="Müqaviləyə əlavə"
            titleIcon={<AttachFileIcon />}
            overviewCards={overviews}
            sum={allCount}
            onExportCSV={() => dt.current.exportCSV()}
            showTimeRange
            handleFilter={({from, to}) =>  getAnnexes({ ...filters, "annex_created_after": from , "annex_created_before" : to })}
            data={annexes}
            columns={columns}
        >
             <ExtendedTable
                headerTitle="Müqaviləyə əlavələrin siyahısı"
                data={annexes}
                loading={loading}
                columns={columns}
                elRef={dt}
                enqueueSnackbar={enqueueSnackbar}
                getData={getAnnexes}
                filters={filters}
                setFilters={setFilters}
                tableLoading={tableLoading}
            />


        </PageContent>
    )
}


export default Annexes;