import { makeAsyncCall } from "../utils"
import {BACKEND_URL} from './../constants'


const index = () =>
    makeAsyncCall({
        url: `${BACKEND_URL}stub-api/`,
        method: 'GET',
    });


export const ContractsService = {
    index: () => index(),
}