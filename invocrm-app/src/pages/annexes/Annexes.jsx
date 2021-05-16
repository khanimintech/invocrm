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
    { id: 2, status: "ƏDV-li", count: 0, icon: <AccessAlarmIcon />, color: "#7E57C2" },
    { id: 3, status: "Cəmi əlavə", count: 0, icon: <HourglassEmptyIcon />, color: "#FFB300" },
]

const columns = [
    { field: 'company_name', header: 'Şirkət', filter: true },
    { field: '6', header: 'Sorğu №', filter: true  },
    { field: '5', header: 'Müqavilə Nömrəsi' , filter: true },
    { field: 'type', header: 'Müqavilə Növü' , filter: true },
    { field: 'contract_id', header: 'Əlavə №' , filter: true },
    { field: 'sales_name', header: "Satış Meneceri" , filter: true },
    { field: '1', header: "Məhsul", filter: true  },
    { field: '2', header: "Ödəniş şərti" , filter: true },
    { field: '3', header: "Məbləğ (ƏDV-siz)" , filter: true },
    { field: '4', header: "Məbləğ (ƏDV-li)" , filter: true },
    { field: 'created', header: 'Yaradılma Tarixi', filter: true  },
    { field: 'end_date', header: "Qarşı tərəfin imza tarixi" , filter: true },
];


const Annexes = ({ handleRequest, user, loading, enqueueSnackbar }) => {
    let dt = useRef(null);

    const [overviews, setOverviews] = useState(initialOverviews);
    const [annexes, setAnnexes] = useState(null);





    const getAnnexes = (filters) => {
        handleRequest(
            AnnexesService.index(filters)
        ).then(res => {
            setAnnexes(res.body.data)
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
            />


        </PageContent>
    )
}


export default Annexes;