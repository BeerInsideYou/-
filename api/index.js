import axios from 'axios';
import CookieManager from '@react-native-cookies/cookies'

export const base = 'http://szpskov.edu-soft.ru'

export const Api = axios.create({
    withCredentials: true,
    baseURL: base,
    timeout: 1000,
    validateStatus: function (status) {
        return status === 200 || status === 204 || status === 400 ;
    }
});

// Api.interceptors.response.use(
//   response => {
//       console.log(response)
//       return response
//   }
// )

export function x1rpc(service, method, params) {
    return Api.post(`${base}/extjs/direct`, {
        action: 'X1API',
        method: 'direct',
        type: 'rpc',
        data: [{
            method: method,
            params: params,
            service: service
        }]
    }).then(response => response.data.hasOwnProperty('data')
      ? Promise.resolve(response.data.data)
      : Promise.reject(response.data.message))
}

Api.interceptors.response.use(
  response => {
      return response
  },
  async error => {
      console.log('request error')
      const cookie = await CookieManager.getAll(base)
     console.log(cookie)
      return Promise.reject(error.response)
  }
)

export function upload(tname, fname, guid, data) {
    return Api.post( `${base}/file/upload?TNAME=${tname}&FNAME=${fname}&REC_GUID=${guid}`, data).
        then(response => response.data.hasOwnProperty('success') && response.data.success ? Promise.resolve(response.data.items) : Promise.reject(response.data.message))
}


export function removeFile(guid) {
    return Api.post(`${base}/file/delete/${guid}`)
        .then(response => response.data.hasOwnProperty('status') && response.data.status === 'success' ? Promise.resolve(response.data) : Promise.reject(response.data.message))
}
