import { configureStore, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { loginRoute, registerRoute } from '../utils/APIRoutes';
import userAuthSlice from './slices/userAuthSlice';
import userPostSlice from './slices/userPostsSlics';

export const store = configureStore({
	reducer: {
		userAuth: userAuthSlice.reducer,
		userPosts: userPostSlice.reducer,
	},
});
