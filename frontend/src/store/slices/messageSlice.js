import { createAsyncThunk, createSlice, isAsyncThunkAction } from '@reduxjs/toolkit';
import axios from 'axios';
import {
	getAllMessageRoute,
	getMessageNotifRoute,
	newMessagesRoute,
	readMessageRoute,
	sendMessageRoute,
} from '../../utils/APIRoutes';

const messageInitialState = {
	message: null,
	from: null,
	to: null,
};

export const sendMessage = createAsyncThunk('messages/sendMessage', async ({ from, to, message }) => {
	try {
		const { data } = await axios.post(sendMessageRoute, { from, to, message });
		return data;
	} catch (err) {
		throw err;
	}
});

export const getAllMessage = createAsyncThunk('messages/sendMessage', async ({ from, to }) => {
	try {
		const { data } = await axios.post(getAllMessageRoute, { from, to });
		return data;
	} catch (err) {
		throw err;
	}
});

export const getMessageNotif = createAsyncThunk('messages/getMessageNotif', async ({ currentUserId }) => {
	try {
		const { data } = await axios.post(getMessageNotifRoute, { currentUserId });
		return data;
	} catch (err) {
		throw err;
	}
});

export const newMessages = createAsyncThunk('messages/newMessages', async ({ currentUserId }) => {
	try {
		const { data } = await axios.post(newMessagesRoute, { currentUserId });

		return data;
	} catch (err) {
		throw err;
	}
});

export const readMessage = createAsyncThunk('messages/readMessage', async ({ currentUserId, currentChatId }) => {
	try {
		const { data } = await axios.post(readMessageRoute, { currentUserId, currentChatId });
	} catch (err) {
		throw err;
	}
});

const messageSlice = createSlice({
	name: 'Messages',
	initialState: messageInitialState,
	extraReducers: (builder) => {
		builder
			.addCase(sendMessage.pending, (state) => {
				state.loading = 'pending';
			})
			.addCase(sendMessage.fulfilled, (state, action) => {
				state.loading = 'fulfilled';
				state.userData = action.payload;
			})
			.addCase(sendMessage.rejected, (state, action) => {
				state.loading = 'rejected';
				state.error = action.error.message;
			});
	},
});
