import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import {
	getAllUsersRoute,
	loginRoute,
	postRoute,
	registerRoute,
	searchUserRoute,
	setProfileRoute,
	testRoute,
} from '../../utils/APIRoutes';

const userInitialState = {
	userData: {
		email: '',
		fullName: '',
		password: '',
		isProfilePicSet: false,
		profilePic: '',
	},
	post: {},
	error: null,
	loading: 'idle',
};

// async functions
export const registerUser = createAsyncThunk('user/registerUser', async ({ email, fullName, password }) => {
	try {
		const { data } = await axios.post(registerRoute, {
			email,
			fullName,
			password,
		});

		return data;
	} catch (err) {
		throw err;
	}
});

export const loginUser = createAsyncThunk('user/loginUser', async ({ email, password }) => {
	try {
		const { data } = await axios.post(loginRoute, {
			email,
			password,
		});

		return data;
	} catch (err) {
		throw err;
	}
});

export const setProfilePic = createAsyncThunk('user/setProfilePic', async ({ id, profilePic }) => {
	try {
		const { data } = await axios.post(`${setProfileRoute}/${id}`, {
			image: profilePic,
		});

		return data;
	} catch (err) {
		throw err;
	}
});

export const getAllUsers = createAsyncThunk('user/getAllUsers', async ({ currentUserId }) => {
	try {
		const { data } = await axios.get(`${getAllUsersRoute}/${currentUserId}`);

		return data;
	} catch (err) {
		throw err;
	}
});

export const searchUser = createAsyncThunk('user/searchUser', async ({ searchInput }) => {
	try {
		if (searchInput.length !== 0) {
			const { data } = await axios.post(`${searchUserRoute}/${searchInput}`);
			return data;
		} else {
			const { data } = await axios.post(`${searchUserRoute}/${null}`);
			return data;
		}
	} catch (err) {
		throw err;
	}
});

const userAuthSlice = createSlice({
	name: 'User Authentication',
	initialState: userInitialState,
	reducers: {
		setUserData: (state, action) => {
			state.userData = action.payload;
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(registerUser.pending, (state) => {
				state.loading = 'pending';
			})
			.addCase(registerUser.fulfilled, (state, action) => {
				state.loading = 'fulfilled';
				state.userData = action.payload;
			})
			.addCase(registerUser.rejected, (state, action) => {
				state.loading = 'rejected';
				state.error = action.error.message;
			});
		builder
			.addCase(loginUser.pending, (state) => {
				state.loading = 'pending';
			})
			.addCase(loginUser.fulfilled, (state, action) => {
				state.loading = 'fulfilled';
				state.userData = action.payload;
				// console.log(state.userData);
			})
			.addCase(loginUser.rejected, (state, action) => {
				state.loading = 'rejected';
				state.error = action.error.message;
			});
		builder
			.addCase(setProfilePic.pending, (state) => {
				state.loading = 'pending';
			})
			.addCase(setProfilePic.fulfilled, (state, action) => {
				state.loading = 'fulfilled';
				state.userData = action.payload;
			})
			.addCase(setProfilePic.rejected, (state, action) => {
				state.loading = 'rejected';
				state.error = action.error.message;
			});
	},
});

export const { setUserData } = userAuthSlice.actions;

export default userAuthSlice;
