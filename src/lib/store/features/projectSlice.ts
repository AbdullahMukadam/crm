import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { CreateFeedbackRequest, Project } from '@/types/project';
import projectService from '@/lib/api/projectsService';

interface ProjectsState {
  projects: Project[];
  isLoading: boolean;
  isUpdateLoading: boolean;
  error: string | null;
}

const initialState: ProjectsState = {
  projects: [],
  isLoading: false,
  isUpdateLoading: false,
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
      throw new Error('Failed to update project');
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'An error occurred');
    }
  }
);

export const fetchProject = createAsyncThunk(
  'projects/fetchProject',
  async (data: { id: string }, { rejectWithValue }) => {
    try {
      const response = await projectService.deleteProject(data);
      if (response.success) {
        return data;
      }
      throw new Error('Failed to update project');
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'An error occurred');
    }
  }
);

export const createFeedback = createAsyncThunk(
  'projects/createFeedback',
  async (data: Partial<CreateFeedbackRequest>, { rejectWithValue }) => {
    try {
      const response = await projectService.createFeedback(data);
      if (response.success && response.data) {
        return response.data;
      }
      throw new Error('Failed to update project');
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
        state.projects = state.projects.map((p) => p.id === action.payload.id ? action.payload : p)
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
        state.projects = state.projects.filter((p) => p.id !== action.payload.id)
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
      })
      .addCase(fetchProject.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      .addCase(createFeedback.pending, (state) => {
        state.isUpdateLoading = true;
        state.error = null;
      })
      .addCase(createFeedback.fulfilled, (state, action: PayloadAction<Project>) => {
        state.isUpdateLoading = false;
        state.projects = state.projects.map((p) => p.id === action.payload.id ? action.payload : p)
      })
      .addCase(createFeedback.rejected, (state, action) => {
        state.isUpdateLoading = false;
        state.error = action.payload as string;
      })

  },
});

export const { clearError } = projectsSlice.actions;
export default projectsSlice.reducer;