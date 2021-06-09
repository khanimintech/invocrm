import React, { useState, useRef } from 'react';
import PageContent from '../../components/PageContainer';
import { BanksService } from '../../services/BanksService';
import ExtendedTable from '../../components/ExtendedTable';
import ContactPhoneIcon from '@material-ui/icons/ContactPhone';


const columns = [
    { field: 'company_tin', header: 'VÖEN' , filter: true },
    { field: 'account', header: 'Hesab №' , filter: true },
    { field: 'company_name', header: 'Şirkət' , filter: true },
    { field: 'name', header: 'Bank adı', filter: true  },
    { field: 'swift_no', header: "SWIFT" , filter: true },
    { field: 'code', header: "Bank kodu" , filter: true },
    { field: 'tin', header: "Bank VÖEN", filter: true  },
    { field: 'correspondent_account', header: "Müxbir hesab" , filter: true },
];


const Banks = ({ handleRequest, loading, enqueueSnackbar }) => {
    let dt = useRef(null);
    const [banks, setBanks] = useState(null);
    const [filters, setFilters] = useState({});



    const getBanks = (filters) => {
        return handleRequest(
            BanksService.index(filters)
        ).then(res => {
            setBanks(res.body)
        })
    }


    return (
        <PageContent
            title="Bank rekvizitləri"
            titleIcon={<ContactPhoneIcon />}
            onExportCSV={() => dt.current.exportCSV()}
            sum={banks ? banks.length : 0}
            data={banks}
            columns={columns}
        >
             <ExtendedTable
                data={banks}
                loading={loading}
                columns={columns}
                elRef={dt}
                actions={{edit: true}}
                headerTitle="Rekvizitləri siyahısı"
                enqueueSnackbar={enqueueSnackbar}
                getData={getBanks}
                filters={filters}
                setFilters={setFilters}
            />


        </PageContent>
    )
}


export default Banks;