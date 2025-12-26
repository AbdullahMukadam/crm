import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { CreateFeedbackRequest, Project, Feedback, replyFeedbackRequest, CreateInvoiceRequest, EditInvoiceRequest } from '@/types/project';
import projectService from '@/lib/api/projectsService';

interface ProjectsState {
  projects: Project[];
  reviewProject: Project | null;
  isLoading: boolean;
  isUpdateLoading: boolean;
  isFeedbackLoading: boolean;
  isInvoiceLoading: boolean;
  isDeletingInvoice: boolean;
  isEditingInvoice: boolean;
  error: string | null;
}

const initialState: ProjectsState = {
  projects: [],
  reviewProject: null,
  isLoading: false,
  isUpdateLoading: false,
  isFeedbackLoading: false,
  isInvoiceLoading: false,
  isDeletingInvoice: false,
  isEditingInvoice: false,
  error: null,
};

// Async Thunks
export const fetchProjects = createAsyncThunk(
  'projects/fetchProjects',
  async (_, { rejectWithValue }) => {
    try {
      const response = await projectService.fetchProjects();
      if (response.success && response.data) {
        return response.data;
      }
      throw new Error('Failed to fetch projects');
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'An error occurred');
    }
  }
);

export const updateProject = createAsyncThunk(
  'projects/updateProject',
  async (data: Partial<Project>, { rejectWithValue }) => {
    try {
      const response = await projectService.updateProject(data);
      if (response.success && response.data) {
        return response.data;
      }
      throw new Error('Failed to update project');
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'An error occurred');
    }
  }
);

export const deleteProject = createAsyncThunk(
  'projects/deleteProject',
  async (data: { id: string }, { rejectWithValue }) => {
    try {
      const response = await projectService.deleteProject(data);
      if (response.success) {
        return data;
      }
      throw new Error('Failed to delete project');
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'An error occurred');
    }
  }
);

export const fetchProject = createAsyncThunk(
  'projects/fetchProject',
  async (data: { id: string }, { rejectWithValue }) => {
    try {
      const response = await projectService.fetchProject(data);
      if (response.success && response.data) {
        return response.data;
      }
      throw new Error('Failed to fetch project');
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'An error occurred');
    }
  }
);

// Updated: Now returns just the feedback, not the entire project
export const createFeedback = createAsyncThunk(
  'projects/createFeedback',
  async (data: CreateFeedbackRequest, { rejectWithValue }) => {
    try {
      const response = await projectService.createFeedback(data);
      if (response.success && response.data) {
        // Return both the feedback and projectId for state update
        return {
          feedback: response.data,
          projectId: data.id // assuming id is the project id
        };
      }
      throw new Error('Failed to create feedback');
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'An error occurred');
    }
  }
);

// Updated: Now returns just the reply, not the entire project
export const replyFeedback = createAsyncThunk(
  'projects/replyFeedback',
  async (data: replyFeedbackRequest, { rejectWithValue }) => {
    try {
      const response = await projectService.replyFeedback(data);
      if (response.success && response.data) {
        // Return the reply with context for state update
        return {
          reply: response.data,
          feedbackId: data.feedbackId,
          projectId: data.id // assuming id is the project id
        };
      }
      throw new Error('Failed to reply');
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'An error occurred');
    }
  }
);

export const createInvoice = createAsyncThunk(
  'projects/createInvoice',
  async (data: CreateInvoiceRequest, { rejectWithValue }) => {
    try {
      const response = await projectService.createInvoice(data);
      if (response.success && response.data) {
        // Return both the feedback and projectId for state update
        return {
          invoice: response.data,
          projectId: data.projectId // assuming id is the project id
        };
      }
      throw new Error('Failed to create Invoice');
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'An error occurred');
    }
  }
);

export const deleteInvoiceSlice = createAsyncThunk(
  'projects/deleteInvoice',
  async (data: { id: string }, { rejectWithValue }) => {
    try {
      const response = await projectService.deleteInvoice(data);
      if (response.success && response.data) {
        return {
          invoiceId: data.id,
          projectId: response.data.projectId
        };
      }
      throw new Error('Failed to delete Invoice');
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'An error occurred');
    }
  }
);

export const editInvoiceSlice = createAsyncThunk(
  'projects/editInvoice',
  async (data: Partial<EditInvoiceRequest>, { rejectWithValue }) => {
    try {
      const response = await projectService.editInvoice(data);
      if (response.success && response.data) {
        return {
          invoice: response.data,
          projectId: response.data.projectId
        };
      }
      throw new Error('Failed to delete Invoice');
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'An error occurred');
    }
  }
);


const projectsSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    findReviewProject: (state, action: PayloadAction<{ id: string }>) => {
      const project = state.projects.find((p) => p.id === action.payload.id);
      if (project) {
        state.reviewProject = project;
      }
    },
    clearReviewProject: (state) => {
      state.reviewProject = null;
    },
    addFeedbackRealtime: (state, action: PayloadAction<{ projectId: string; feedback: Feedback }>) => {
      const { projectId, feedback } = action.payload;

      // Update in projects array
      const projectIndex = state.projects.findIndex((p) => p.id === projectId);
      if (projectIndex !== -1) {
        if (!state.projects[projectIndex].Feedback) {
          state.projects[projectIndex].Feedback = [];
        }
        // Check if feedback already exists (avoid duplicates)
        const exists = state.projects[projectIndex].Feedback.some(f => f.id === feedback.id);
        if (!exists) {
          state.projects[projectIndex].Feedback.push(feedback);
        }
      }

      // Update reviewProject if it matches
      if (state.reviewProject?.id === projectId) {
        if (!state.reviewProject.Feedback) {
          state.reviewProject.Feedback = [];
        }
        const exists = state.reviewProject.Feedback.some(f => f.id === feedback.id);
        if (!exists) {
          state.reviewProject.Feedback.push(feedback);
        }
      }
    },

    addReplyRealtime: (state, action: PayloadAction<{ projectId: string; feedbackId: string; reply: Feedback }>) => {
      const { projectId, feedbackId, reply } = action.payload;

      const addReplyToFeedback = (feedbackList: Feedback[]) => {
        const feedback = feedbackList.find((f) => f.id === feedbackId);
        if (feedback) {
          if (!feedback.replies) {
            feedback.replies = [];
          }
          // Check if reply already exists
          const exists = feedback.replies.some(r => r.id === reply.id);
          if (!exists) {
            feedback.replies.push(reply);
          }
        }
      };

      // Update in projects array
      const projectIndex = state.projects.findIndex((p) => p.id === projectId);
      if (projectIndex !== -1 && state.projects[projectIndex].Feedback) {
        addReplyToFeedback(state.projects[projectIndex].Feedback);
      }

      // Update reviewProject if it matches
      if (state.reviewProject?.id === projectId && state.reviewProject.Feedback) {
        addReplyToFeedback(state.reviewProject.Feedback);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProjects.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProjects.fulfilled, (state, action: PayloadAction<Project[]>) => {
        state.isLoading = false;
        state.projects = action.payload;
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      .addCase(updateProject.pending, (state) => {
        state.isUpdateLoading = true;
        state.error = null;
      })
      .addCase(updateProject.fulfilled, (state, action: PayloadAction<Project>) => {
        state.isUpdateLoading = false;
        // Update in projects array
        const projectIndex = state.projects.findIndex((p) => p.id === action.payload.id);
        if (projectIndex !== -1) {
          state.projects[projectIndex] = action.payload;
        }
        // Update reviewProject if it's the same project
        if (state.reviewProject?.id === action.payload.id) {
          state.reviewProject = action.payload;
        }
      })
      .addCase(updateProject.rejected, (state, action) => {
        state.isUpdateLoading = false;
        state.error = action.payload as string;
      })

      .addCase(deleteProject.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteProject.fulfilled, (state, action) => {
        state.isLoading = false;
        state.projects = state.projects.filter((p) => p.id !== action.payload.id);
        // Clear reviewProject if it was deleted
        if (state.reviewProject?.id === action.payload.id) {
          state.reviewProject = null;
        }
      })
      .addCase(deleteProject.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      .addCase(fetchProject.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProject.fulfilled, (state, action) => {
        state.isLoading = false;
        const existingIndex = state.projects.findIndex(p => p.id === action.payload.id);
        if (existingIndex >= 0) {
          state.projects[existingIndex] = action.payload;
        } else {
          state.projects.push(action.payload);
        }
        state.reviewProject = action.payload;
      })
      .addCase(fetchProject.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Updated: Optimistically add feedback to project
      .addCase(createFeedback.pending, (state) => {
        state.isFeedbackLoading = true;
        state.error = null;
      })
      .addCase(createFeedback.fulfilled, (state, action) => {
        state.isFeedbackLoading = false;
      })
      .addCase(createFeedback.rejected, (state, action) => {
        state.isFeedbackLoading = false;
        state.error = action.payload as string;
      })

      // Updated: Optimistically add reply to feedback
      .addCase(replyFeedback.pending, (state) => {
        state.isFeedbackLoading = true;
        state.error = null;
      })
      .addCase(replyFeedback.fulfilled, (state, action) => {
        state.isFeedbackLoading = false;

      })
      .addCase(replyFeedback.rejected, (state, action) => {
        state.isFeedbackLoading = false;
        state.error = action.payload as string;
      })

      //create Invoice
      .addCase(createInvoice.pending, (state) => {
        state.isInvoiceLoading = true;
        state.error = null;
      })
      .addCase(createInvoice.fulfilled, (state, action) => {
        state.isInvoiceLoading = false;
        const projectIndex = state.projects.findIndex((p) => p.id === action.payload.projectId);
        if (projectIndex !== -1) {
          state.projects[projectIndex].invoices?.push(action.payload.invoice)
        }

      })
      .addCase(createInvoice.rejected, (state, action) => {
        state.isInvoiceLoading = false;
        state.error = action.payload as string;
      })

      //delete invoice
      .addCase(deleteInvoiceSlice.pending, (state) => {
        state.isDeletingInvoice = true;
        state.error = null;
      })
      .addCase(deleteInvoiceSlice.fulfilled, (state, action) => {
        state.isDeletingInvoice = false;
        const projectIndex = state.projects.findIndex((p) => p.id === action.payload.projectId);
        if (projectIndex !== -1) {
          let allInvoices = state.projects[projectIndex].invoices?.filter((inv) => inv.id !== action.payload.invoiceId)
          state.projects[projectIndex].invoices = allInvoices
        }

      })
      .addCase(deleteInvoiceSlice.rejected, (state, action) => {
        state.isDeletingInvoice = false;
        state.error = action.payload as string;
      })


      //edit invoice
      .addCase(editInvoiceSlice.pending, (state) => {
        state.isEditingInvoice = true;
        state.error = null;
      })
      .addCase(editInvoiceSlice.fulfilled, (state, action) => {
        state.isEditingInvoice = false;
        const projectIndex = state.projects.findIndex((p) => p.id === action.payload.projectId);
        if (projectIndex !== -1 && state.projects[projectIndex].invoices) {
          const inVoiceIndex = state.projects[projectIndex].invoices?.findIndex((inv) => inv.id === action.payload.invoice.id)
          if (inVoiceIndex !== -1) {
            state.projects[projectIndex].invoices[inVoiceIndex] = action.payload.invoice
          }
        }

      })
      .addCase(editInvoiceSlice.rejected, (state, action) => {
        state.isEditingInvoice = false;
        state.error = action.payload as string;
      })
  },
});

export const { clearError, findReviewProject, clearReviewProject, addFeedbackRealtime, addReplyRealtime } = projectsSlice.actions;
export default projectsSlice.reducer;