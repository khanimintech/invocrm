import { makeAsyncCall, createFilterUrl } from "../utils"
import { BACKEND_URL } from './../constants'


const index = (filters) =>
    makeAsyncCall({
        url: createFilterUrl(`${BACKEND_URL}contracts/`, filters),
        method: 'GET',
    });

const remove = (id) =>
    makeAsyncCall({
        url: `${BACKEND_URL}contracts/${id}/`,
        method: 'DELETE',
    });


const getSalesManagers = () =>
    makeAsyncCall({
        url: `${BACKEND_URL}sales-managers/`,
        method: 'GET',
    });

const getSellers = () =>
    makeAsyncCall({
        url: `${BACKEND_URL}sellers/`,
        method: 'GET',
    });

const save = values =>
    makeAsyncCall({
        url: `${BACKEND_URL}contracts/`,
        method: 'POST',
        body: JSON.stringify(values)
    });


const getItem = id =>
    makeAsyncCall({
        url: `${BACKEND_URL}contracts/${id}/`,
        method: 'GET',
    });

const createAnnex = values => 
    makeAsyncCall({
        url: `${BACKEND_URL}annexes/`,
        method: 'POST',
        body: JSON.stringify(values)
    });

const getStateCounts = filters =>
    makeAsyncCall({
        url: createFilterUrl(`${BACKEND_URL}status-count/`, filters),
        method: 'GET',
    });

export const ContractsService = {
    index: (filters) => index(filters),
    getItem: id => getItem(id),
    remove: id => remove(id),
    getSalesManagers: () => getSalesManagers(),
    getSellers: () => getSellers(),
    save: values => save(values),
    createAnnex: vals => createAnnex(vals),
    getStateCounts: filters => getStateCounts(filters)
}