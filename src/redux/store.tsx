// store.js

import { createStore, combineReducers } from 'redux';
import teamReducer from './reducer';

export type RootState = ReturnType<typeof rootReducer>;
const rootReducer = combineReducers({
  team: teamReducer
});

const store = createStore(rootReducer);

export default store;
