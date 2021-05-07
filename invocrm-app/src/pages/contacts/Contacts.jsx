import React, { useState, useRef, useEffect } from 'react';
import PageContent from '../../components/PageContainer';
import { ContractsService } from '../../services/ContractsService';
import ExtendedTable from '../../components/ExtendedTable';
import ContactPhoneIcon from '@material-ui/icons/ContactPhone';


const columns = [
    { field: 'company_name', header: 'Müştəri' },
    { field: 'contract_id', header: 'Ünvan' },
    { field: 'contract_id', header: 'Əlaqədar şəxs' },
    { field: 'type', header: 'Əlaqə nömrəsi' },
    { field: 'contract_id', header: 'Əlavə №' },
    { field: 'sales_name', header: "Şəxsi e-ünvan" },
    { field: 'sales_name', header: "WEB sayt" },
];


const Contacts = ({ handleRequest, user, loading, enqueueSnackbar }) => {
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
            title="Müştəri ilə əlaqə"
            titleIcon={<ContactPhoneIcon />}
            onExportCSV={() => dt.current.exportCSV()}
        >
             <ExtendedTable
                data={contacts}
                loading={loading}
                columns={columns}
                elRef={dt}
                actions={{edit: true, delete: true}}
                headerTitle="Əlaqələrin siyahısı"
                enqueueSnackbar={enqueueSnackbar}
            />


        </PageContent>
    )
}


export default Contacts;