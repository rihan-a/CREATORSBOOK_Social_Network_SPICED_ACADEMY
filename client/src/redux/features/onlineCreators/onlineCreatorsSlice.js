import { createSlice } from '@reduxjs/toolkit';

const onlineCreatorsSlice = createSlice({
    name: "onlineCreators",
    initialState: {
        creatorsDataList: []
    },
    // action creators
    reducers: {
        online: (state, action) => {
            state.creatorsDataList = action.payload;
        },
        offline: (state, action) => {
            // remove disconnected creator from the DataList
            state.creatorsDataList = state.creatorsDataList.filter((creator) => creator.id != action.payload);
        },
    }
});

// Action creators are generated for each case reducer function
export const { online, offline } = onlineCreatorsSlice.actions;
export default onlineCreatorsSlice.reducer;




