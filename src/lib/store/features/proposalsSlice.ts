import proposalService from "@/lib/api/proposalService";
import { ProposalState } from "@/types/proposal";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";


const initialState: ProposalState = {
    proposals: [],
    isLoading: false,
    error: null
}

export const FetchProposals = createAsyncThunk(
    "proposals/fetchAll",
    async (_, { rejectWithValue }) => {
        try {
            const proposalResponse = await proposalService.getProposals()
            if (!proposalResponse.success) {
                return rejectWithValue(proposalResponse.message || "Failed to fetch proposals")
            }
            return proposalResponse.data
        } catch (error) {
            return rejectWithValue("Failed to fetch proposals")
        }
    }
)

export const ProposalSlice = createSlice({
    name: 'proposals',
    initialState,
    reducers: {
        removeProposals: (state) => {
            Object.assign(state, {
                ...initialState,
                isLoading: false,
                error: null,
                proposals: []
            })
        }
    },
    extraReducers: (builder) => {

        builder
            .addCase(FetchProposals.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(FetchProposals.fulfilled, (state, action) => {
                state.isLoading = false;
                if (action.payload) {
                    Object.assign(state, action.payload)
                }
            })
            .addCase(FetchProposals.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string || "Failed to fetch proposals";
            })
    }
})

export const { removeProposals } = ProposalSlice.actions
export default ProposalSlice.reducer