import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import proposalService from '@/lib/api/proposalService';
import { Proposal, CreatePropsalRequest, ProposalUpdateRequest, CreateProposalResponse, ProposalStatus } from '@/types/proposal';

interface ProposalsState {
  proposals: Proposal[];
  currentProposal: Proposal | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: ProposalsState = {
  proposals: [],
  currentProposal: null,
  isLoading: false,
  error: null,
};

// Async Thunks
export const fetchProposals = createAsyncThunk(
  'proposals/fetchProposals',
  async (_, { rejectWithValue }) => {
    try {
      const response = await proposalService.getProposals();
      if (response.success && response.data) {
        return response.data;
      }
      throw new Error('Failed to fetch proposals');
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'An error occurred');
    }
  }
);

export const fetchProposal = createAsyncThunk(
  'proposals/fetchProposal',
  async (proposalId: string, { rejectWithValue }) => {
    try {
      const response = await proposalService.getProposal(proposalId);
      if (response.success && response.data) {
        return response.data.proposal;
      }
      throw new Error('Failed to fetch proposal');
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'An error occurred');
    }
  }
);

export const createProposalSlice = createAsyncThunk(
  'proposals/createProposal',
  async (data: CreatePropsalRequest, { rejectWithValue }) => {
    try {
      const response = await proposalService.createProposal(data);
      if (response.success && response.data) {
        return response.data.proposal;
      }
      throw new Error('Failed to create proposal');
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'An error occurred');
    }
  }
);

export const saveProposal = createAsyncThunk(
  'proposals/saveProposal',
  async (data: ProposalUpdateRequest, { rejectWithValue }) => {
    try {
      const response = await proposalService.saveProposal(data);
      if (response.success) {
        return data;
      }
      throw new Error('Failed to save proposal');
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'An error occurred');
    }
  }
);

export const deleteProposal = createAsyncThunk(
  'proposals/deleteProposal',
  async (proposalId: string, { rejectWithValue }) => {
    try {
      const response = await proposalService.deleteProposal(proposalId);
      if (response.success) {
        return proposalId;
      }
      throw new Error('Failed to delete proposal');
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'An error occurred');
    }
  }
);

export const updateProposalStatus = createAsyncThunk(
  'proposals/updateProposalStatus',
  async (data: { proposalId: string; status: string }, { rejectWithValue }) => {
    try {
      const response = await proposalService.updateProposalStatus(data);
      if (response.success) {
        return data;
      }
      throw new Error('Failed to update proposal status');
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'An error occurred');
    }
  }
);

const proposalsSlice = createSlice({
  name: 'proposals',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentProposal: (state) => {
      state.currentProposal = null;
    },
    removeProposals: (state) => {
      Object.assign(state, {
          ...initialState,
          isLoading: false,
          error: null,
          proposals: [],
          currentProposal : null
      })
  }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Proposals
      .addCase(fetchProposals.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProposals.fulfilled, (state, action: PayloadAction<Proposal[]>) => {
        state.isLoading = false;
        state.proposals = action.payload;
      })
      .addCase(fetchProposals.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch Single Proposal
      .addCase(fetchProposal.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProposal.fulfilled, (state, action: PayloadAction<Proposal>) => {
        state.isLoading = false;
        state.currentProposal = action.payload;
      })
      .addCase(fetchProposal.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Create Proposal
      .addCase(createProposalSlice.pending, (state) => {
        state.error = null;
      })
      .addCase(createProposalSlice.fulfilled, (state, action) => {
        state.isLoading = false;
      })
      .addCase(createProposalSlice.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Save Proposal
      .addCase(saveProposal.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(saveProposal.fulfilled, (state, action: PayloadAction<ProposalUpdateRequest>) => {
        state.isLoading = false;
        const idx = state.proposals.findIndex((p) => p.id === action.payload.proposalId);
        if (idx !== -1) {
          state.proposals[idx] = { ...state.proposals[idx], ...action.payload };
        }
        if (state.currentProposal?.id === action.payload.proposalId) {
          state.currentProposal = { ...state.currentProposal, ...action.payload };
        }
      })
      .addCase(saveProposal.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Delete Proposal
      .addCase(deleteProposal.pending, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(deleteProposal.fulfilled, (state, action: PayloadAction<string>) => {
        state.isLoading = false;
        state.proposals = state.proposals.filter((p) => p.id !== action.payload);
      })
      .addCase(deleteProposal.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Update Proposal Status
      .addCase(updateProposalStatus.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateProposalStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        const idx = state.proposals.findIndex((p) => p.id === action.payload.proposalId);
        if (idx !== -1) {
          state.proposals[idx].status = action.payload.status as ProposalStatus;
        }
      })
      .addCase(updateProposalStatus.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, clearCurrentProposal, removeProposals } = proposalsSlice.actions;
export default proposalsSlice.reducer;