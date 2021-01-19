import { createStore, combineReducers } from 'redux';
import catlog from './reducers/catlogs';

const rootReducer = combineReducers({ catlog });

export default function configStore() {
  const store = createStore(rootReducer);
  return store;
}
