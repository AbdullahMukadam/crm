import { authService } from '@/lib/api/authService'
import { AuthState, SigninCredentials, SignupCredentials } from '@/types/auth'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

const initialState: AuthState = {
    id: null,
    username: null,
    email: null,
    avatarUrl: null,
    role: 'user',
    onboarded: false,
    isLoading: false,
    error: null,
    isAuthenticated: false,
}

export const SignupUser = createAsyncThunk(
    'auth/signup',
    async (userCredentials: SignupCredentials, { rejectWithValue }) => {
        try {
            const response = await authService.signup(userCredentials);

            if (!response.success) {
                return rejectWithValue(response.message || 'Failed to sign up user');
            }
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to sign up user');
        }
    }
)

export const SigninUser = createAsyncThunk(
    "auth/signin",
    async (userCredentials: SigninCredentials, { rejectWithValue }) => {
        try {
            const response = await authService.signin(userCredentials);

            if (!response.success) {
                return rejectWithValue(response.message || 'Failed to sign in user');
            }
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to sign in user');
        }
    }
)

export const LogoutUser = createAsyncThunk(
    "auth/logout",
    async (_, { rejectWithValue }) => {
        try {
            const response = await authService.logout();

            if (!response.success) {
                return rejectWithValue(response.message || 'Failed to logout user');
            }
            return response;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to logout user');
        }
    }
)

export const AuthSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        addUserDetails: (state, action: PayloadAction<Partial<AuthState>>) => {
            Object.assign(state, action.payload);
        },
        clearError: (state) => {
            state.error = null;
        },
        logout: (state) => {
            Object.assign(state, {
                ...initialState,
                isLoading: false
            });
        }
    },
    extraReducers(builder) {
        builder

            //signup user
            .addCase(SignupUser.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(SignupUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.error = null;
                state.isAuthenticated = true;
                if (action.payload) {
                    state = Object.assign(state, action.payload);
                }
            })
            .addCase(SignupUser.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })

            //signin user
            .addCase(SigninUser.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(SigninUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.error = null;
                state.isAuthenticated = true;
                if (action.payload) {
                    state = Object.assign(state, action.payload);
                }
            })
            .addCase(SigninUser.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })

            //logout user
            .addCase(LogoutUser.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(LogoutUser.fulfilled, (state) => {
                state.isLoading = false;
                state.error = null;
                state.isAuthenticated = false;
                state = Object.assign(state, {
                    ...initialState,
                    isLoading: false
                });
            })
            .addCase(LogoutUser.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
    },
})

export const { addUserDetails, clearError, logout } = AuthSlice.actions

export default AuthSlice.reducer