import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    posts: [],
    postStatus: "idle",
};

const postSlice = createSlice({
    name: "posts",
    initialState,
    reducers: {
        setPosts: (state, action) => {
            state.posts = action.payload;
            state.postStatus = "succeeded";
        },
        addPost: (state, action) => {
            state.posts.unshift(action.payload);
        },
        updatePost: (state, action) => {
            const index = state.posts.findIndex((p) => p.$id === action.payload.$id);
            if (index !== -1) state.posts[index] = action.payload;
        },
        removePost: (state, action) => {
            state.posts = state.posts.filter((p) => p.$id !== action.payload);
        },
    },
});

export const { setPosts, addPost, updatePost, removePost } = postSlice.actions;
export default postSlice.reducer;