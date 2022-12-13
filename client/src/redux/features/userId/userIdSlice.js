import { createSlice } from '@reduxjs/toolkit';

const userIdSlice = createSlice({
    name: "loggedInUserId",
    initialState: {
        userId: 0,
    },
    // action creators
    reducers: {
        getLoggedInUserId: (state, action) => {
            state.userId = action.payload;
        },
    }
});

// Action creators are generated for each case reducer function
export const { getLoggedInUserId } = userIdSlice.actions;
export default userIdSlice.reducer;



