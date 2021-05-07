import { makeAsyncCall } from "../utils"
import {BACKEND_URL} from './../constants'


const index = () =>
    makeAsyncCall({
        url: `${BACKEND_URL}stub-api/`,
        method: 'GET',
    });

const remove = (id) =>
    makeAsyncCall({
        url: `${BACKEND_URL}contracts/${id}`,
        method: 'DELETE',
    });

export const ContractsService = {
    index: () => index(),
    remove: id => remove(id)
}