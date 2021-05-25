import { makeAsyncCall } from "../utils"
import {BACKEND_URL} from './../constants'


export const LoginService = {
    login: (body) => (
        makeAsyncCall({
            url: `${BACKEND_URL}login`,
            method: 'POST',
            body: JSON.stringify(body)
        })
    ),
    logout: () => (
        makeAsyncCall({
            url: `${BACKEND_URL}logout/`,
            method: 'POST',
        })
    )
}