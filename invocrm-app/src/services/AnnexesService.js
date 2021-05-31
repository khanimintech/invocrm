import { createFilterUrl, makeAsyncCall } from "../utils"
import {BACKEND_URL} from './../constants'


const index = (filters) =>
    makeAsyncCall({
        url: createFilterUrl(`${BACKEND_URL}annexes/`, filters),
        method: 'GET',
    });

const remove = (id) =>
    makeAsyncCall({
        url: `${BACKEND_URL}annexes/${id}`,
        method: 'DELETE',
    });



const save = values => 
    makeAsyncCall({
        url: `${BACKEND_URL}annexes/`,
        method: 'POST',
        body: JSON.stringify(values)
    });

const getUnits = () =>
    makeAsyncCall({
        url: `${BACKEND_URL}units/`,
        method: 'GET',
    });


const getStateCounts = filters =>
    makeAsyncCall({
        url: createFilterUrl(`${BACKEND_URL}annex-status-count/`, filters),
        method: 'GET',
    });

export const AnnexesService = {
    index: (filters) => index(filters),
    remove: id => remove(id),
    save: values => save(values),
    getUnits: () => getUnits(),
    getStateCounts: filters => getStateCounts(filters)
}