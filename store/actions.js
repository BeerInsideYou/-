import { x1rpc } from '../api';
import  AsyncStorage  from '@react-native-async-storage/async-storage';

export const RESET_STATE = 'RESET_STATE';
export const GET_PROGRAMS = 'GET_PROGRAMS';
export const GET_APPEALS = 'GET_APPEALS';
export const GET_RECIPIENT = 'GET_RECIPIENT';
export const GET_PROGRAMS_META = 'GET_PROGRAMS_META';
export const GET_APPEALS_META = 'GET_APPEALS_META';
export const GET_SERVICES_META = 'GET_SERVICES_META';
export const ADD_APPEAL = 'ADD_APPEAL';

export const getRecipient = () => {
  try {
    return async dispatch => {
      const login = await AsyncStorage.getItem('user')
      return x1rpc('client.data.secure', 'read', {
        model: 'INFO_RECIPIENT',
        msource: 'toop',
        filter: JSON.stringify([{
          field: "SNILS",
          type: "list",
          value: login
        }])
      }).then(response => {
        if (response.total > 0) {
          const person = response.items[0]
          dispatch({
            type: GET_RECIPIENT,
            payload: person
          });
        } else {
          return response
        }
      })
    };
  } catch (error) {
    console.log('getRecepient');
    console.log(error);
  }
}

export const getAppeals = (guid) => {
  try {
    return dispatch => {
      return x1rpc('client.data.secure', 'read', {
        model: 'INFO_STATEMENT_SERVICE',
        msource: 'toop',
        withDisplay: true,
        filter: JSON.stringify([{
          field: "SYS_GUIDFK",
          type: "list",
          value: guid,
        }]),
        order: { 'STATEMENT_DATE' : -1 }
      }).then(response => {
        dispatch({
          type: GET_APPEALS,
          payload: response.items
        });
      })
    }
  } catch (error) {
    console.log(error);
  }
}

export const getPrograms = (guid) => {
  try {
    return dispatch => {
      return x1rpc('client.data.secure', 'read', {
        model: 'INFO_STATEMENT_SERVICE',
        msource: 'toop',
        filter: JSON.stringify([{
          field: "SYS_GUIDFK",
          type: "list",
          value: guid
        }])
      })
        .then(response => {
          if (response.total > 0) {
            const guids = response.items.map(i => i.SYS_GUID)
            return x1rpc('client.data.secure', 'read', {
              model: 'INFO_IND_PROGRAME',
              msource: 'toop',
              withDisplay: true,
              filter: JSON.stringify([{
                field: "SYS_GUIDFK",
                type: "list",
                value: guids
              }]),
              order: { 'DATE_START' : -1 }
            }).then(async response => {
              if (response.total > 0) {
                const programs = response.items
                const guids = programs.map(i => i.SYS_GUID)
                const services = await x1rpc('client.data.secure', 'read', {
                  model: 'INFO_SOC_SERVICE_IND_PROGRAME',
                  msource: 'toop',
                  withDisplay: true,
                  filter: JSON.stringify([{
                    field: "SYS_GUIDFK",
                    type: "list",
                    value: guids
                  }])
                }).then(r => r.items)

                programs.map(item => {
                  let targets = services.filter(s => s.SYS_GUIDFK === item.SYS_GUID)
                  if (targets) {
                    if (!Object.prototype.hasOwnProperty.call(item, 'services'))
                      item['services'] = [];
                    item['services'] = targets
                    item['SERVICES_COUNT'] = targets.length
                  }
                })

                dispatch({
                  type: GET_PROGRAMS,
                  payload: programs
                });
              }
            })
          } else {
            return response;
          }
        })
    }
  } catch (error) {
    console.log(error);
  }
}

export const getMeta = (table) => {
  try {
    return dispatch => {
      let type = null;
      switch (table) {
        case 'INFO_IND_PROGRAME' :
          type = GET_PROGRAMS_META;
          break;
        case 'INFO_STATEMENT_SERVICE' :
          type = GET_APPEALS_META;
          break;
        case 'INFO_SOC_SERVICE_IND_PROGRAME' :
          type = GET_SERVICES_META;
          break;
      }
      return x1rpc('client.meta.secure', 'getModels', {models: [table]})
        .then(async response => {
            if (response.length > 0) {
              let meta = response[0]
              const lookups = meta.fields.filter(field => field.TYPE === 'lookup' || field.TYPE === 'multilookup' && !field.isSystem)
              if (lookups.length > 0) {
                await Promise.all(
                  lookups.map((field, index) => {
                    return x1rpc('client.data.secure', 'readLookup', {
                      model: table,
                      lookupField: field.NAME
                    })
                      .then(response => {
                        field['values'] = response.items
                      })
                      .catch(e => {
                        console.log(e);
                        field['values'] = []
                      })
                  })
                )
              }
              dispatch({
                type: type,
                payload: meta
              });
            }
            return response;
          }
        )
    }
  } catch (error) {
    console.log(error);
  }
}

export const addAppeal = (values) => {
    console.log('add appeal')
    return dispatch => {
      return x1rpc('client.data.secure', 'submit', {
        model: 'INFO_STATEMENT_SERVICE',
        values: values
      }).then(response => {
        console.log(response)
        dispatch({
          type: ADD_APPEAL,
          payload: response.item
        });
        return response
      })
    }
}

