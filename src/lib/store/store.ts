import { configureStore } from '@reduxjs/toolkit'
import authReducer from './features/authSlice'
import proposalReducer from './features/proposalsSlice'
import leadsReducer from './features/leadSlice'
import projectsReducer from './features/projectSlice'


export const Store = () => {
    return configureStore({
        reducer: {
            auth: authReducer,
            proposal: proposalReducer,
            leads: leadsReducer,
            projects: projectsReducer,
        },
    })
}


export type AppStore = ReturnType<typeof Store>
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']