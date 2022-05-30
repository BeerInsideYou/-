import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import programsReducer from './programs';
import appealsReducer from './appeals';
import recipientReducer from './recipient';
import metaReducer from './meta';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { persistStore, persistReducer } from 'redux-persist';


const allReducers = combineReducers({
  recipientReducer : persistReducer({key: 'recipient', storage: AsyncStorage, whitelist: ['recipient']}, recipientReducer),
  programsReducer,
  appealsReducer,
  metaReducer
});

const rootReducer = (state, action) => {
  if (action.type === 'RESET_STATE') {
    state = undefined;
  }
  return allReducers(state, action);
}

export const store = createStore(rootReducer, applyMiddleware(thunk));
export const persistor = persistStore(store);
