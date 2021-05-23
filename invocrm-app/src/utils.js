import { BACKEND_URL } from './constants';
import { format, parseISO } from 'date-fns'

function processResponse(response) {
  const statusCode = response.status;
  const data = response.json();
  return Promise.all([statusCode, data]).then(res => {
    const statusCode = res[0];
    const body = res[1] || undefined;
    const response = { statusCode, body };
    if (statusCode >= 200 && statusCode < 300) return response;
    else throw response;
  });
}

export function makeAsyncCall(options){
  const { method, body, url, headers } = options;
  const requestHeaders = new Headers();
  requestHeaders.set('Content-Type', 'application/json');
  requestHeaders.set('Accept', 'application/json');

  if (headers) {
    Object.keys(headers).forEach((key) => {
      if (headers[key] === null) {
        requestHeaders.delete(key);
      } else {
        requestHeaders.set(key, headers[key]);
      }
    });
  }


  return fetch(url, {
    method,
    headers: requestHeaders,
    body,
    ...(url.match('^' + BACKEND_URL) ? { credentials: 'include' } : {}),
  }).then((res) => {
    return processResponse(res);
  });
}


export const validateRequired = value => {
  let err;
  if (!value) return err = "Bu sahə mütləqdir";
  return err;
}

export const createFilterUrl = (url, filters) => {
  let filterUrl = `${url}?`
  if (filters)
      Object.keys(filters).map(field => {
          if (filters[field])
            filterUrl +=`${field}=${filters[field]}&`
      })
  return filterUrl;
}