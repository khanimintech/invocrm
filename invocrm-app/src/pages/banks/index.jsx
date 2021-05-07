import React, { useState, useRef, useEffect } from 'react';
import PageContent from '../../components/PageContainer';
import { ContractsService } from '../../services/ContractsService';
import ExtendedTable from '../../components/ExtendedTable';
import ContactPhoneIcon from '@material-ui/icons/ContactPhone';


const columns = [
    { field: 'company_name', header: 'VÖEN' },
    { field: 'contract_id', header: 'Hesab №' },
    { field: 'contract_id', header: 'Bank adı' },
    { field: 'type', header: 'Yerləşdiyi yer' },
    { field: 'contract_id', header: 'Şəhər' },
    { field: 'sales_name', header: "SWIFT" },
    { field: 'sales_name', header: "Bank kodu" },
    { field: 'sales_name', header: "Bank VÖEN" },
    { field: 'sales_name', header: "Müxbir hesab" },
];


const Banks = ({ handleRequest, user, loading, enqueueSnackbar }) => {
    let dt = useRef(null);
    const [contacts, setContacts] = useState(null);


    useEffect(() => {
        getContacts();
    }, [])



    const getContacts = () => {
        handleRequest(
            ContractsService.index()
        ).then(res => {
            setContacts(res.body.data)
        })
    }


    return (
        <PageContent
            title="Bank rekvizitləri"
            titleIcon={<ContactPhoneIcon />}
            onExportCSV={() => dt.current.exportCSV()}
        >
             <ExtendedTable
                data={contacts}
                loading={loading}
                columns={columns}
                elRef={dt}
                actions={{edit: true, delete: true}}
                headerTitle="Rekvizitləri siyahısı"
                enqueueSnackbar={enqueueSnackbar}
            />


        </PageContent>
    )
}


export default Banks;