import { BACKEND_URL } from './constants';
import { format, parseISO } from 'date-fns'

function processResponse(response) {
  const statusCode = response.status;
  const data = statusCode === 204 ? response : response.json();
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
  if (value || value === 0) return err;
  else return err = "Bu sahə mütləqdir"
}

export const createFilterUrl = (url, filters) => {
  let filterUrl = `${url}?`
  if (filters)
      Object.keys(filters).map(field => {
          if (filters[field] || filters[field] === 0)
            filterUrl +=`${field}=${filters[field]}&`
      })
  return filterUrl;
}


export  const formatDateString = value => {
  return value ? format(parseISO(value), "MM.dd.yyyy") : "-"
}