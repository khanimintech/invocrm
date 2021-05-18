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
        url: `${BACKEND_URL}contacts/`,
        method: 'POST',
        body: JSON.stringify(values)
    });

export const ContactsService = {
    index: (filters) => index(filters),
    remove: id => remove(id),
    save: values => save(values)
}