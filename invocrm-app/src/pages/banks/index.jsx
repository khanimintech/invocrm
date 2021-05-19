import React, { useState, useRef, useEffect } from 'react';
import PageContent from '../../components/PageContainer';
import { BanksService } from '../../services/BanksService';
import ExtendedTable from '../../components/ExtendedTable';
import ContactPhoneIcon from '@material-ui/icons/ContactPhone';


const columns = [
    { field: 'company_tin', header: 'VÖEN' , filter: true },
    { field: 'account', header: 'Hesab №' , filter: true },
    { field: 'name', header: 'Bank adı', filter: true  },
    // { field: 'address', header: 'Yerləşdiyi yer', filter: true  },
    // { field: 'city', header: 'Şəhər', filter: true  },
    { field: 'swift_no', header: "SWIFT" , filter: true },
    { field: 'code', header: "Bank kodu" , filter: true },
    { field: 'tin', header: "Bank VÖEN", filter: true  },
    { field: 'correspondent_account', header: "Müxbir hesab" , filter: true },
];


const Banks = ({ handleRequest, user, loading, enqueueSnackbar }) => {
    let dt = useRef(null);
    const [banks, setBanks] = useState(null);




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