import { createFilterUrl, makeAsyncCall } from "../utils"
import {BACKEND_URL} from './../constants'


const index = (filters) =>
    makeAsyncCall({
        url: createFilterUrl(`${BACKEND_URL}banks/`, filters),
        method: 'GET',
    });

const remove = (id) =>
    makeAsyncCall({
        url: `${BACKEND_URL}banks/${id}`,
        method: 'DELETE',
    });



const save = values => 
    makeAsyncCall({
        url: `${BACKEND_URL}banks/`,
        method: 'POST',
        body: JSON.stringify(values)
    });

export const BanksService = {
    index: (filters) => index(filters),
    remove: id => remove(id),
    save: values => save(values)
}