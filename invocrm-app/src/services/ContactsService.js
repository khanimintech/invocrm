import { createFilterUrl, makeAsyncCall } from "../utils"
import {BACKEND_URL} from './../constants'


const index = (filters) =>
    makeAsyncCall({
        url:  createFilterUrl(`${BACKEND_URL}contacts/`, filters),
        method: 'GET',
    });

const remove = (id) =>
    makeAsyncCall({
        url: `${BACKEND_URL}contacts/${id}`,
        method: 'DELETE',
    });



const save = values => 
    makeAsyncCall({
        url: `${BACKEND_URL}contacts/${values.id ? `${values.id}/` : ""}`,
        method: values.id ? "PUT" : 'POST',
        body: JSON.stringify(values)
    });

const getContact = id =>
    makeAsyncCall({
        url: `${BACKEND_URL}contacts/${id}/`,
        method: 'GET'
    });

export const ContactsService = {
    index: (filters) => index(filters),
    remove: id => remove(id),
    save: values => save(values),
    getItem: id => getContact(id)
}