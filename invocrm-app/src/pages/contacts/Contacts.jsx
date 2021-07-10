import React, { useState, useRef } from 'react';
import PageContent from '../../components/PageContainer';
import ExtendedTable from '../../components/ExtendedTable';
import ContactPhoneIcon from '@material-ui/icons/ContactPhone';
import { ContactsService } from '../../services/ContactsService';
import AddBoxIcon from '@material-ui/icons/AddBox';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';

import "./styles.scss";
import CreateContactModal from './CreateContactModal';


const columns = [
    { field: 'customer', header: 'Müştəri', filter: true, showDetails: true},
    { field: 'address', header: 'Ünvan' , filter: true},
    { field: 'responsible_person', header: 'Əlaqədar şəxs' , filter: true},
    { field: 'company_name', header: 'Şirkət' , filter: true},
    { field: 'mobile', header: 'Əlaqə nömrəsi' , filter: true},
    { field: 'personal_email', header: "Şəxsi e-ünvan" , filter: true},
    { field: 'web_site', header: "WEB sayt" , filter: true},
    { field: 'work_email', header: "İş e-ünvanı" , filter: true},
];


const Contacts = ({ handleRequest, user, loading, enqueueSnackbar }) => {
    let dt = useRef(null);
    const [contacts, setContacts] = useState(null);
    const [filters, setFilters] = useState({});
    const [createModal, toggleCreateModal] = useState(false);
    const [selectedContact, setSelectedContact] = useState();


    const getContacts = (filters) => {
        return handleRequest(
            ContactsService.index(filters)
        ).then(res => {
            setContacts(res.body)
        })
    }

    const getContact = (contact) => {
        return handleRequest(
            ContactsService.getItem(contact.id)
        ).then(({ body }) => {
            toggleCreateModal(true)
            setSelectedContact(body)
        })
    }

    const addIcon = (
        <Tooltip title="Kontakt yarat" placement="top-end">
            <IconButton
                aria-label="kontakt"
                onClick={() => toggleCreateModal(true)}
                className="add-icon"
            >
                <AddBoxIcon />
            </IconButton>
        </Tooltip>
    )



    return (
        <PageContent
            title="Müştəri ilə əlaqə"
            titleIcon={<ContactPhoneIcon />}
            onExportCSV={() => dt.current.exportCSV()}
            sum={contacts ? contacts.length : 0}
            data={contacts}
            columns={columns}
            addIcon={addIcon}
        >
             <ExtendedTable
                data={contacts}
                loading={loading}
                columns={columns}
                elRef={dt}
                headerTitle="Əlaqələrin siyahısı"
                enqueueSnackbar={enqueueSnackbar}
                getData={getContacts}
                filters={filters}
                setFilters={setFilters}
                getItem={getContact}
            />
            {
                createModal ? (
                    <CreateContactModal
                        open={true}
                        handleClose={() => toggleCreateModal(false)}
                        handleRequest={handleRequest}
                        reloadData={getContacts}
                        seelctedContact={selectedContact}
                    />
                ) : null
            }

        </PageContent>
    )
}


export default Contacts;