import { makeAsyncCall, createFilterUrl } from "../utils"
import {BACKEND_URL} from './../constants'


const index = (filters) =>
    makeAsyncCall({
        url: createFilterUrl(`${BACKEND_URL}contracts/`, filters),
        method: 'GET',
    });

const remove = (id) =>
    makeAsyncCall({
        url: `${BACKEND_URL}contracts/${id}`,
        method: 'DELETE',
    });


    const getSalesManagers = ()=> 
        makeAsyncCall({
            url: `${BACKEND_URL}sales-managers/`,
            method: 'GET',
        });

    const save = values => 
    makeAsyncCall({
        url: `${BACKEND_URL}contracts/`,
        method: 'POST',
        body: JSON.stringify(values)
    });

export const ContractsService = {
    index: (filters) => index(filters),
    remove: id => remove(id),
    getSalesManagers: () => getSalesManagers(),
    save: values => save(values)
}