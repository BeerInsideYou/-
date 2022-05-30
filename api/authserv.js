import { Api, base as Apibase } from './index'
import AsyncStorage  from '@react-native-async-storage/async-storage'
import CookieManager from '@react-native-cookies/cookies'

const appkey = encodeURIComponent('Pfobnybr2022>')

const base = 'http://integrics.ru:8944'
const getAsynsStorage = async (key, value) => {
  await AsyncStorage.setItem(key, value)
}
export function auth (login, password) {
  return Api.get(`${base}/auth?appkey=${appkey}&login=${login}&passwd=${password}`, { withCredentials: false })
    .then( r => {
      let data = r.data
      data['passwd'] = password
      data['session'] = {
        login: data['login']
      }
      return Api.post(`${base}/auth?appkey=${appkey}`, data, { withCredentials: false }).then(response => {
        console.log(response.data)
        if (response.data.sid) {
          CookieManager.set(Apibase, {
            name: 'X1_SSO',
            value: response.data.sid,
            path: '/'
          }).catch(er => { console.log(er) })
        }
        if (response.data.login) {
          let userdata = {
            username: response.data.login,
            role: []
          }
          if (response.data.membership) {
            response.data.membership.map(item => { userdata.role.push(item.groupfk) })
          }
          getAsynsStorage('user', userdata.username);
          getAsynsStorage('role', JSON.stringify(userdata.role))
          return Promise.resolve(userdata)
        }
        return Promise.reject(response)
      }).catch(e => {
        return Promise.reject(new Error(error.data))
      })
    }).catch(error => {
      return Promise.reject(new Error(error.data))
    })
}

export function authBySso () {
  const sso = AsyncStorage.getItem('x1sso')
  return Api.post(`${base}/session/get?appkey=${appkey}`, {sid: sso, membership: 1}).then(response => {
    let userdata = {
      username: response.data.data.login,
      role: []
    }
    if (response.data.data.membership) {
      response.data.data.membership.map(item => { userdata.role.push(item.groupfk) })
    }
    return Promise.resolve(userdata)
  }).catch(error => {
    return Promise.reject(new Error(error.data))
  })
}

export function createUser (login, password, email = null, confirm = false) {
  let data = {
    login: login,
    x_passwd: password
  }
  if (email) {
    data['email'] = email
  }
  if (confirm) {
    data['confirm'] = true
  }
  return Api.post(`${base}/user/register?appkey=${appkey}`, data)
}

