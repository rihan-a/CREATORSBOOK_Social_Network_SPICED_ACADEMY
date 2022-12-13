import { createSlice } from '@reduxjs/toolkit';



const collabsSlice = createSlice({
    name: "collabs",
    initialState: {
        possibleCollabs: [],

    },
    // action creators
    reducers: {
        getCollabs: (state, action) => {
            state.possibleCollabs = action.payload;
        },

        deleteCollab: (state, action) => {
            console.log(" decline in slice", action.payload);
            let updatedList = state.possibleCollabs.filter((collab) => {
                return collab.id != action.payload;
            });
            state.possibleCollabs = updatedList;
        },


        acceptCollab: (state, action) => {
            let updatedList = state.possibleCollabs.map((collab) => {
                if (collab.id === action.payload) {
                    return { ...collab, accepted: true };
                }
                return collab;
            });
            state.possibleCollabs = updatedList;
        },


    }
});


// Action creators are generated for each case reducer function
export const { getCollabs, deleteCollab, acceptCollab } = collabsSlice.actions;

export default collabsSlice.reducer;

