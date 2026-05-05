import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:8000';

export const sendMessage = createAsyncThunk(
  'interaction/sendMessage',
  async ({ message, currentFormData }, { getState }) => {
    const response = await axios.post(`${API_URL}/chat/`, {
      message,
      session_id: 'session-1', // Simplified
      current_form_data: currentFormData
    });
    return response.data;
  }
);

export const saveInteraction = createAsyncThunk(
  'interaction/saveInteraction',
  async (formData) => {
    const response = await axios.post(`${API_URL}/interactions/`, formData);
    return response.data;
  }
);

const interactionSlice = createSlice({
  name: 'interaction',
  initialState: {
    formData: {
      hcp_id: '',
      interaction_type: 'Meeting',
      date: new Date().toISOString().split('T')[0],
      time: '09:00',
      attendees: '',
      topics_discussed: '',
      sentiment: 'Neutral',
      outcomes: '',
      follow_up_actions: ''
    },
    chatHistory: [],
    loading: false,
    error: null
  },
  reducers: {
    updateField: (state, action) => {
      const { field, value } = action.payload;
      state.formData[field] = value;
    },
    addMessage: (state, action) => {
      state.chatHistory.push({ role: 'user', content: action.payload });
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendMessage.pending, (state) => {
        state.loading = true;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.loading = false;
        state.chatHistory.push({ role: 'assistant', content: action.payload.response });
        // Update form data if the AI extracted new info
        if (action.payload.updated_form_data) {
          state.formData = { ...state.formData, ...action.payload.updated_form_data };
        }
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  }
});

export const { updateField, addMessage } = interactionSlice.actions;
export default interactionSlice.reducer;
