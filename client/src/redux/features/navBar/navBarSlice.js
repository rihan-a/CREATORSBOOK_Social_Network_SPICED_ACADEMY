import { createSlice } from '@reduxjs/toolkit';

const navBarSlice = createSlice({
    name: "navBarColor",
    initialState: {
        navBarActive: "",
    },
    // action creators
    reducers: {
        activateNavBar: (state, action) => {
            state.navBarActive = action.payload;
        },

    }
});

// Action creators are generated for each case reducer function
export const { activateNavBar } = navBarSlice.actions;

export default navBarSlice.reducer;



