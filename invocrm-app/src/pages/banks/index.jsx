import React, { useState, useRef, useEffect } from 'react';
import PageContent from '../../components/PageContainer';
import { BanksService } from '../../services/BanksService';
import ExtendedTable from '../../components/ExtendedTable';
import ContactPhoneIcon from '@material-ui/icons/ContactPhone';


const columns = [
    { field: 'company_name', header: 'VÖEN' , filter: true },
    { field: 'contract_id', header: 'Hesab №' , filter: true },
    { field: 'contract_id', header: 'Bank adı', filter: true  },
    { field: 'type', header: 'Yerləşdiyi yer', filter: true  },
    { field: 'contract_id', header: 'Şəhər', filter: true  },
    { field: 'sales_name', header: "SWIFT" , filter: true },
    { field: 'sales_name', header: "Bank kodu" , filter: true },
    { field: 'sales_name', header: "Bank VÖEN", filter: true  },
    { field: 'sales_name', header: "Müxbir hesab" , filter: true },
];


const Banks = ({ handleRequest, user, loading, enqueueSnackbar }) => {
    let dt = useRef(null);
    const [banks, setBanks] = useState(null);



    const getBanks = (filters) => {
        handleRequest(
            BanksService.index(filters)
        ).then(res => {
            setBanks(res.body.data)
        })
    }


    return (
        <PageContent
            title="Bank rekvizitləri"
            titleIcon={<ContactPhoneIcon />}
            onExportCSV={() => dt.current.exportCSV()}
        >
             <ExtendedTable
                data={banks}
                loading={loading}
                columns={columns}
                elRef={dt}
                actions={{edit: true, delete: true}}
                headerTitle="Rekvizitləri siyahısı"
                enqueueSnackbar={enqueueSnackbar}
                getData={getBanks}
            />


        </PageContent>
    )
}


export default Banks;