import { authService } from '@/lib/api/authService'
import { AuthState, SigninCredentials, SignupCredentials, UpdateProfileRequest } from '@/types/auth'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

const initialState: AuthState = {
    id: null,
    username: null,
    email: null,
    avatarUrl: null,
    role: 'CLIENT',
    onboarded: false,
    isLoading: false,
    error: null,
    isAuthenticated: false,
    isInitialized: false, // Track if we've checked for existing auth
}

// Validate existing JWT token on app startup
export const ValidateStoredAuth = createAsyncThunk(
    'auth/validateStored',
    async (_, { rejectWithValue }) => {
        try {
            const response = await authService.validateSession();

            if (!response.success) {
                return rejectWithValue(response.message || 'Session expired');
            }
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Session validation failed');
        }
    }
)

// Get current user data
export const GetCurrentUser = createAsyncThunk(
    'auth/getCurrentUser',
    async (_, { rejectWithValue }) => {
        try {
            const response = await authService.getCurrentUser();

            if (!response.success) {
                return rejectWithValue(response.message || 'Failed to get user data');
            }
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to get user data');
        }
    }
)

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
            return response;
        } catch (error: any) {
            return { success: true };
        }
    }
)

export const UpdateProfile = createAsyncThunk(
    "auth/UpdateProfile",
    async (data: Partial<UpdateProfileRequest>, { rejectWithValue }) => {
        try {
            const response = await authService.updateProfile(data);

            if (!response.success) {
                return rejectWithValue(response.message || 'Failed to update the profile');
            }
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to sign in user');
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
                isLoading: false,
                isInitialized: true
            });
        },
        setInitialized: (state) => {
            state.isInitialized = true;
        }
    },
    extraReducers(builder) {
        builder

            // validate stored auth (JWT token)
            .addCase(ValidateStoredAuth.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(ValidateStoredAuth.fulfilled, (state, action) => {
                state.isLoading = false;
                state.error = null;
                state.isAuthenticated = true;
                state.isInitialized = true;
                if (action.payload) {
                    Object.assign(state, action.payload);
                }
            })
            .addCase(ValidateStoredAuth.rejected, (state, action) => {
                state.isLoading = false;
                state.error = null; // Don't show error for expired sessions
                state.isAuthenticated = false;
                state.isInitialized = true;
                Object.assign(state, {
                    ...initialState,
                    isLoading: false,
                    isInitialized: true
                });
            })

            // get current user
            .addCase(GetCurrentUser.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(GetCurrentUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.error = null;
                if (action.payload) {
                    Object.assign(state, action.payload);
                }
            })
            .addCase(GetCurrentUser.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })

            //signup user
            .addCase(SignupUser.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(SignupUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.error = null;
                state.isAuthenticated = true;
                state.isInitialized = true;
                if (action.payload) {
                    Object.assign(state, action.payload);
                }
            })
            .addCase(SignupUser.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
                state.isInitialized = true;
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
                state.isInitialized = true;
                if (action.payload) {
                   Object.assign(state, action.payload)
                }
            })
            .addCase(SigninUser.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
                state.isInitialized = true;
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
                state.isInitialized = true;
                Object.assign(state, {
                    ...initialState,
                    isLoading: false,
                    isInitialized: true
                });
            })
            .addCase(LogoutUser.rejected, (state) => {
                state.isLoading = false;
                state.isAuthenticated = false;
                state.isInitialized = true;
                Object.assign(state, {
                    ...initialState,
                    isLoading: false,
                    isInitialized: true
                });
            })

            .addCase(UpdateProfile.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(UpdateProfile.fulfilled, (state, action) => {
                state.isLoading = false;
                state.error = null;
                if (action.payload) {
                    Object.assign(state, action.payload);
                }
            })
            .addCase(UpdateProfile.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
                state.isInitialized = true;
            })
    },
})

export const { addUserDetails, clearError, logout, setInitialized } = AuthSlice.actions

export default AuthSlice.reducer