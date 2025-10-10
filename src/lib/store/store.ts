import { configureStore } from '@reduxjs/toolkit'
import authReducer from './features/authSlice'
import proposalReducer from './features/proposalsSlice'

export const Store = () => {
    return configureStore({
        reducer: {
            auth: authReducer,
            proposal: proposalReducer,
        },
    })
}


export type AppStore = ReturnType<typeof Store>
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']