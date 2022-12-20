import { createSlice } from '@reduxjs/toolkit';

const boardSlice = createSlice({
    name: "board",
    initialState: {
        brushColor: "#000000",
        brushSize: 15,
        recentSketch: "",
    },
    // action creators
    reducers: {
        setBrushColor: (state, action) => {
            state.brushColor = action.payload;
        },
        setBrushSize: (state, action) => {
            state.brushSize = action.payload;
        },
        saveSketch: (state, action) => {
            let drawings = action.payload;
            state.recentSketch = drawings;
        },

    }
});

// Action creators are generated for each case reducer function
export const { setBrushColor, setBrushSize, saveSketch } = boardSlice.actions;

export default boardSlice.reducer;



