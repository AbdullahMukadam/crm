import { configureStore } from '@reduxjs/toolkit'
import authReducer from './features/authSlice'

export const Store = () => {
    return configureStore({
        reducer: {
            auth: authReducer
        },
    })
}


export type AppStore = ReturnType<typeof Store>
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']