import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { baseUrl } from '../../shared/baseUrl';



export const fetchComments = createAsyncThunk(
    'comments/fetchComments',
    async () => {
        const response = await fetch(baseUrl + 'comments');
        return response.json();
    }
);

export const postComment = createAsyncThunk(
    'comments/postComments',
    async (payload, { dispatch, getState }) => {
        setTimeout(() => {
            const { comments } = getState();
            payload.date = new Date().toISOString();
            payload.id = comments.commentsArray.length;
            dispatch(addComment(payload));
        }, 2000);
    }
)

const commentsSlice = createSlice({
    name: 'comments',
    initialState: { isLoading: true, errMess: null, commentsArray: [] },
    reducers: {
        addComment: (state, action) => {
            state.commentsArray.push(action.payload);
        }
    },
    extraReducers: {
        [fetchComments.pending]: (state) => {
            state.isLoading = true;
        },
        [fetchComments.fulfilled]: (state, action) => {
            state.isLoading = false;
            state.errMess = null;
            state.commentsArray = action.payload;
        },
        [fetchComments.rejected]: (state, action) => {
            state.isLoading = false;
            state.errMess = action.error ? action.error.message : 'Fetch failed';
        }
    }
});


export const { addComment } = commentsSlice.actions;
export const commentsReducer = commentsSlice.reducer;