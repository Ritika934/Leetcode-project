import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authslice"
import themeReducer from './themeslice';

export const store = configureStore({
    reducer:{
        slice1 :  authReducer,
        theme: themeReducer
    }
})