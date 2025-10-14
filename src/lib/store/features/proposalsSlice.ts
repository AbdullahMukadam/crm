import proposalService from "@/lib/api/proposalService";
import { Proposal, ProposalState } from "@/types/proposal";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";


const initialState: ProposalState = {
    proposals: [],
    isLoading: false,
    error: null
}

export const FetchProposals = createAsyncThunk<
  Proposal[], 
  void,      
  { rejectValue: string } 
>(
  "proposals/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const proposalResponse = await proposalService.getProposals()
      if (!proposalResponse.success) {
        return rejectWithValue(proposalResponse.message || "Failed to fetch proposals")
      }
      console.log(proposalResponse)
      return proposalResponse.data as Proposal[] 
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
                    console.log("redux", action.payload)
                    state.proposals = action.payload;
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