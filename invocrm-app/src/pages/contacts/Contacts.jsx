import React, { useState, useRef, useEffect } from 'react';
import PageContent from '../../components/PageContainer';
import ExtendedTable from '../../components/ExtendedTable';
import ContactPhoneIcon from '@material-ui/icons/ContactPhone';
import { ContactsService } from '../../services/ContactsService';

import "./styles.scss";


const columns = [
    { field: 'company_name', header: 'Müştəri', filter: true},
    { field: 'contract_id', header: 'Ünvan' , filter: true},
    { field: 'contract_id', header: 'Əlaqədar şəxs' , filter: true},
    { field: 'type', header: 'Əlaqə nömrəsi' , filter: true},
    { field: 'contract_id', header: 'Əlavə №', filter: true },
    { field: 'sales_name', header: "Şəxsi e-ünvan" , filter: true},
    { field: 'sales_name', header: "WEB sayt" , filter: true},
];


const Contacts = ({ handleRequest, user, loading, enqueueSnackbar }) => {
    let dt = useRef(null);
    const [contacts, setContacts] = useState(null);



    const getContacts = (filters) => {
        handleRequest(
            ContactsService.index(filters)
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
                getData={getContacts}
            />


        </PageContent>
    )
}


export default Contacts;