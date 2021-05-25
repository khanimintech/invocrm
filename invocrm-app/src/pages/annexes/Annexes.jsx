import React, { useState, useRef, useEffect } from 'react';
import PageContent from '../../components/PageContainer';
import PriorityHighIcon from '@material-ui/icons/PriorityHigh';
import AccessAlarmIcon from '@material-ui/icons/AccessAlarm';
import HourglassEmptyIcon from '@material-ui/icons/HourglassEmpty';
import AttachFileIcon from '@material-ui/icons/AttachFile';
import { AnnexesService } from '../../services/AnnexesService';
import ExtendedTable from '../../components/ExtendedTable';


const initialOverviews = [
    { id: 1, status: "ƏDV-siz", count: 0, icon: <PriorityHighIcon />, color: "#42A5F5" },
    { id: 2, status: "ƏDV-li", count: 0, icon: <AccessAlarmIcon />, color: "rgb(90 89 204)" },
    { id: 3, status: "Cəmi əlavə", count: 0, icon: <HourglassEmptyIcon />, color: "#FFB300" },
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





    const getAnnexes = (filters) => {
        return handleRequest(
            AnnexesService.index(filters)
        ).then(res => {
            if (res.body){
                setAnnexes(res.body)
                const withVat = res.body.filter(a => a.with_vat)
                const withoutVat = res.body.filter(a =>  !a.with_vat)
                const updatedOverviews = overviews.map( o => {
                    if (o.id === 2) return { ...o, count: withVat? withVat.length : 0}
                    if (o.id === 1) return { ...o, count: withoutVat? withoutVat.length : 0}
                    if (o.id === 3) return { ...o, count: res.body ? res.body.length : 0}
                })
                setOverviews(updatedOverviews)
            }

            
        })
    }


    return (
        <PageContent
            title="Müqaviləyə əlavə"
            titleIcon={<AttachFileIcon />}
            overviewCards={overviews}
            sum={annexes ? annexes.length : 0}
            onExportCSV={() => dt.current.exportCSV()}
        >
             <ExtendedTable
                headerTitle="Müqaviləyə əlavələrin siyahısı"
                data={annexes}
                loading={loading}
                columns={columns}
                elRef={dt}
                actions={{edit: true, delete: true}}
                enqueueSnackbar={enqueueSnackbar}
                getData={getAnnexes}
                showTimeRange
                entityName="annex"
            />


        </PageContent>
    )
}


export default Annexes;