import { createSlice } from '@reduxjs/toolkit';

const userDataSlice = createSlice({
    name: "loggedInUserData",
    initialState: {
        userData: {},
        otherUserData: {}
    },
    // action creators
    reducers: {
        getLoggedInUserData: (state, action) => {
            state.userData = action.payload;
        },

        getOtherUserData: (state, action) => {
            state.otherUserData = action.payload;
        },

    }
});

// Action creators are generated for each case reducer function
export const { getLoggedInUserData, getOtherUserData } = userDataSlice.actions;
export default userDataSlice.reducer;



