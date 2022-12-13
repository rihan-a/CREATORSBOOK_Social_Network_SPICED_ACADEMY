import { createSlice } from '@reduxjs/toolkit';

const postsSlice = createSlice({
    name: "posts",
    initialState: {
        postsList: [],
    },
    // action creators
    reducers: {
        getPosts: (state, action) => {
            state.postsList = action.payload;
        },
        addLastPost: (state, action) => {
            state.postsList = [action.payload, ...state.postsList];
        },
    }
});

// Action creators are generated for each case reducer function
export const { getPosts, addLastPost } = postsSlice.actions;

export default postsSlice.reducer;



