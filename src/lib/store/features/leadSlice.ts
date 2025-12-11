import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import brandingService from '@/lib/api/brandingService';
import { LeadsDataForDashboard } from '@/types/branding';

interface LeadsState {
    leads: LeadsDataForDashboard[];
    isLoading: boolean;
    error: string | null;
}

const initialState: LeadsState = {
    leads: [],
    isLoading: false,
    error: null,
};

// Async Thunks
export const fetchLeadsSlice = createAsyncThunk(
    'leads/fetchLeads',
    async (_, { rejectWithValue }) => {
        try {
            const response = await brandingService.fetchLeads();
            if (response.success && response.data) {
                return response.data;
            }
            throw new Error('Failed to fetch leads');
        } catch (error) {
            return rejectWithValue(error instanceof Error ? error.message : 'An error occurred');
        }
    }
);

export const createLead = createAsyncThunk(
    'leads/createLead',
    async (formData: any, { rejectWithValue }) => {
        try {
            const response = await brandingService.createLead(formData);
            if (response.success) {
                return formData;
            }
            throw new Error('Failed to create lead');
        } catch (error) {
            return rejectWithValue(error instanceof Error ? error.message : 'An error occurred');
        }
    }
);

export const deleteLead = createAsyncThunk(
    'leads/deleteLead',
    async (id: string, { rejectWithValue }) => {
        try {
            const response = await brandingService.deleteLead(id);
            if (response.success) {
                return id;
            }
            throw new Error('Failed to delete lead');
        } catch (error) {
            return rejectWithValue(error instanceof Error ? error.message : 'An error occurred');
        }
    }
);

export const updateLeadStatusSlice = createAsyncThunk(
    'leads/updateLeadStatus',
    async (data: { leadId: string; status: string }, { rejectWithValue }) => {
        try {
            const response = await brandingService.updateLeadStatus(data.leadId, data.status);
            if (response.success) {
                return data;
            }
            throw new Error('Failed to update lead status');
        } catch (error) {
            return rejectWithValue(error instanceof Error ? error.message : 'An error occurred');
        }
    }
);

export const searchLeads = createAsyncThunk(
    'leads/searchLeads',
    async (query: string, { rejectWithValue }) => {
        try {
            const response = await brandingService.searchLeads({ query });
            if (response.success && response.data) {
                return response.data;
            }
            throw new Error('Failed to search leads');
        } catch (error) {
            return rejectWithValue(error instanceof Error ? error.message : 'An error occurred');
        }
    }
);

const leadsSlice = createSlice({
    name: 'leads',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch Leads
            .addCase(fetchLeadsSlice.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchLeadsSlice.fulfilled, (state, action: PayloadAction<LeadsDataForDashboard[]>) => {
                state.isLoading = false;
                state.leads = action.payload;
            })
            .addCase(fetchLeadsSlice.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            // Create Lead
            .addCase(createLead.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(createLead.fulfilled, (state, action) => {
                state.isLoading = false;
                state.leads.unshift(action.payload);
            })
            .addCase(createLead.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            // Delete Lead
            .addCase(deleteLead.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(deleteLead.fulfilled, (state, action: PayloadAction<string>) => {
                state.isLoading = false;
                state.leads = state.leads.filter((lead) => lead.id !== action.payload);
            })
            .addCase(deleteLead.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            // Update Lead Status
            .addCase(updateLeadStatusSlice.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(updateLeadStatusSlice.fulfilled, (state, action) => {
                state.isLoading = false;
                const idx = state.leads.findIndex((lead) => lead.id === action.payload.leadId);
                if (idx !== -1) {
                    state.leads[idx].status = action.payload.status;
                }
            })
            .addCase(updateLeadStatusSlice.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            // Search Leads
            .addCase(searchLeads.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(searchLeads.fulfilled, (state, action: PayloadAction<LeadsDataForDashboard[]>) => {
                state.isLoading = false;
                state.leads = action.payload;
            })
            .addCase(searchLeads.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });
    },
});

export const { clearError } = leadsSlice.actions;
export default leadsSlice.reducer;