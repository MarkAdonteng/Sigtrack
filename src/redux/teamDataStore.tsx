import { configureStore } from '@reduxjs/toolkit';
import teamReducer from './teamDataSlice';

const store = configureStore({
    reducer: {
        team: teamReducer,
    },
});

export default store;
