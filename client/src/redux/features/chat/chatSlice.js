import { createSlice } from '@reduxjs/toolkit';

const chatSlice = createSlice({
    name: "messages",
    initialState: {
        chatMessages: [],
    },
    // action creators
    reducers: {
        chatMessagesReceived: (state, action) => {
            state.chatMessages = action.payload;
        },
        chatMessageReceived: (state, action) => {
            state.chatMessages = [action.payload, ...state.chatMessages];
        },
    }
});

// Action creators are generated for each case reducer function
export const { chatMessagesReceived, chatMessageReceived } = chatSlice.actions;

export default chatSlice.reducer;



