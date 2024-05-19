import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

import {
	addCommentRoute,
	findPostsRoute,
	getAllPostsRoute,
	getCommentsRoute,
	getLikesRoute,
	getNotifRoute,
	getPostRoute,
	getUserRoute,
	likePostRoute,
	newPostRoute,
	readNotifRoute,
} from '../../utils/APIRoutes';

const postInitialState = {
	loading: 'idle', // or 'pending' if you want to show loading by default
	error: null,
	postDetails: { userData: {}, caption: '', img: '' },
	posts: [],
	postComments: [],
};

export const newPost = createAsyncThunk('user/newPost', async ({ caption, image, fullName, profilePic, authorId }) => {
	try {
		const formData = new FormData();
		formData.append('caption', caption);
		formData.append('image', image);
		formData.append('profilePic', profilePic);
		formData.append('fullName', fullName);
		formData.append('authorId', authorId);
		const { data } = await axios.post(newPostRoute, formData, {
			headers: {
				'Content-Type': 'multipart/form-data',
			},
		});

		return data;
	} catch (err) {
		throw err;
	}
});

export const addComment = createAsyncThunk(
	'user/addComment',
	async ({ postId, commentorData, comment, authorName, authorId, currentUserId }) => {
		try {
			const { data } = await axios.post(addCommentRoute, {
				postId,
				commentorData,
				comment,
				authorName,
				authorId,
				currentUserId,
			});

			return data;
		} catch (err) {
			throw err;
		}
	}
);

export const likePost = createAsyncThunk(
	'user/likePost',
	async ({ postId, likerData, authorName, authorId, currentUserId }) => {
		try {
			const { data } = await axios.post(likePostRoute, { postId, likerData, authorName, authorId, currentUserId });

			return data;
		} catch (err) {
			throw err;
		}
	}
);

export const getAllPosts = createAsyncThunk('user/getAllPosts', async () => {
	try {
		const { data } = await axios.get(getAllPostsRoute);
		return data;
	} catch (err) {
		throw err;
	}
});

export const getComments = createAsyncThunk('user/getComments', async ({ postId }) => {
	try {
		const { data } = await axios.get(`${getCommentsRoute}/${postId}`);

		return data;
	} catch (err) {
		throw err;
	}
});

export const getLikes = createAsyncThunk('user/getComments', async ({ postId }) => {
	try {
		const { data } = await axios.get(`${getLikesRoute}/${postId}`);
		return data;
	} catch (err) {
		throw err;
	}
});

export const getNotif = createAsyncThunk('/user/getNotif', async ({ currentUser }) => {
	try {
		const { data } = await axios.get(`${getNotifRoute}/${currentUser}`);
		// console.log(data);
		return data;
	} catch (err) {
		throw err;
	}
});

export const readNotif = createAsyncThunk('/user/readNotif', async ({ currentName, currentId }) => {
	try {
		const { data } = await axios.post(readNotifRoute, { currentName, currentId });
		return data;
	} catch (err) {
		throw err;
	}
});

export const getPost = createAsyncThunk('/user/getPost', async ({ postId }) => {
	try {
		const { data } = await axios.get(`${getPostRoute}/${postId}`);
		return data;
	} catch (err) {
		throw err;
	}
});

export const getUser = createAsyncThunk('/user/getUser', async ({ userId }) => {
	try {
		const { data } = await axios.get(`${getUserRoute}/${userId}`);
		return data;
	} catch (err) {
		throw err;
	}
});

export const findPosts = createAsyncThunk('/user/findPosts', async ({ authorId }) => {
	try {
		const { data } = await axios.post(findPostsRoute, { authorId });

		console.log(data);
		return data;
	} catch (err) {
		throw err;
	}
});

const userPostSlice = createSlice({
	name: 'User Posts',
	initialState: postInitialState,
	extraReducers: (builder) => {
		builder
			.addCase(newPost.pending, (state) => {
				state.loading = 'pending';
			})
			.addCase(newPost.fulfilled, (state, action) => {
				state.loading = 'fulfilled';
				state.postDetails = action.payload;
				console.log(state.postDetails);
			})
			.addCase(newPost.rejected, (state, action) => {
				state.loading = 'rejected';
				state.error = action.error.message;
			});
		builder
			.addCase(addComment.pending, (state) => {
				state.loading = 'pending';
			})
			.addCase(addComment.fulfilled, (state, action) => {
				state.loading = 'fulfilled';
				state.postComments = action.payload;
			})
			.addCase(addComment.rejected, (state, action) => {
				state.loading = 'rejected';
				state.error = action.error.message;
			});
		builder
			.addCase(getAllPosts.pending, (state) => {
				state.loading = 'pending';
			})
			.addCase(getAllPosts.fulfilled, (state, action) => {
				state.loading = 'fulfilled';
				state.posts = action.payload;
			})
			.addCase(getAllPosts.rejected, (state, action) => {
				state.loading = 'rejected';
				state.error = action.error.message;
			});
		builder
			.addCase(getComments.pending, (state) => {
				state.loading = 'pending';
			})
			.addCase(getComments.fulfilled, (state, action) => {
				state.loading = 'fulfilled';
				state.postComments = action.payload;
			})
			.addCase(getComments.rejected, (state, action) => {
				state.loading = 'rejected';
				state.error = action.error.message;
			});
	},
});

export default userPostSlice;
