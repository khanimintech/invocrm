import { makeAsyncCall } from "../utils"
import {BACKEND_URL} from './../constants'


const index = () =>
    makeAsyncCall({
        url: `${BACKEND_URL}contract/`,
        method: 'GET',
    });

const remove = (id) =>
    makeAsyncCall({
        url: `${BACKEND_URL}contract/${id}`,
        method: 'DELETE',
    });

export const ContractsService = {
    index: () => index(),
    remove: id => remove(id)
}