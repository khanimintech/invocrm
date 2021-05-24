import React, { useState, useRef, useEffect } from 'react';
import PageContent from '../../components/PageContainer';
import ExtendedTable from '../../components/ExtendedTable';
import ContactPhoneIcon from '@material-ui/icons/ContactPhone';
import { ContactsService } from '../../services/ContactsService';

import "./styles.scss";


const columns = [
    { field: 'customer', header: 'Müştəri', filter: true},
    { field: 'address', header: 'Ünvan' , filter: true},
    { field: 'responsible_person', header: 'Əlaqədar şəxs' , filter: true},
    { field: 'mobile', header: 'Əlaqə nömrəsi' , filter: true},
    // { field: 'contract_id', header: 'Əlavə №', filter: true },
    { field: 'personal_email', header: "Şəxsi e-ünvan" , filter: true},
    { field: 'web_site', header: "WEB sayt" , filter: true},
];


const Contacts = ({ handleRequest, user, loading, enqueueSnackbar }) => {
    let dt = useRef(null);
    const [contacts, setContacts] = useState(null);



    const getContacts = (filters) => {
        return handleRequest(
            ContactsService.index(filters)
        ).then(res => {
            setContacts(res.body)
        })
    }


    return (
        <PageContent
            title="Müştəri ilə əlaqə"
            titleIcon={<ContactPhoneIcon />}
            onExportCSV={() => dt.current.exportCSV()}
            sum={contacts ? contacts.length : 0}
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