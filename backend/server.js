const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const userRoutes = require('./routes/userRoutes');
const postRoutes = require('./routes/postRoutes');
const messageRoutes = require('./routes/messageRoutes');

const path = require('path');
const socketIo = require('socket.io');
const { log } = require('console');

require('dotenv').config();
const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', userRoutes);
app.use('/api/post', postRoutes);
app.use('/api/message', messageRoutes);

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

mongoose
	.connect(process.env.MONGODB_URL, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then(() => {
		console.log('DB CONNECTED SUCCESSFULLY ^.^');
	})
	.catch((err) => {
		console.log(err);
	});

const server = app.listen(process.env.PORT, () => {
	console.log(`Server started at PORT: ${process.env.PORT}`);
});

const io = socketIo(server, {
	cors: {
		origin: 'http://localhost:3000', // React app's URL
		methods: ['GET', 'POST'],
	},
});

global.onlineUsers = new Map();

io.on('connection', (socket) => {
	global.chatSocket = socket;
	socket.on('add-user', (userId) => {
		onlineUsers.set(userId, socket.id);
	});

	socket.on('send-msg', (data) => {
		if (data.from && data.to) {
			const sendUserSocket = onlineUsers.get(data.to);
			if (sendUserSocket) {
				socket.to(sendUserSocket).emit('msg-recieve', {
					fromSelf: false,
					message: data.message,
				});
			} else {
				console.log(`User ${data.to} not found or offline.`);
			}
		} else {
			console.log('Invalid message data received:', data);
		}
	});

	socket.on('comment', (data) => {
		const recipientSocketId = onlineUsers.get(data.receiverId);
		if (recipientSocketId) {
			io.to(recipientSocketId).emit('new-comments', data.newComments);
		}
	});

	socket.on('like', (data) => {
		const recipientSocketId = onlineUsers.get(data.receiverId);
		if (recipientSocketId) {
			io.to(recipientSocketId).emit('new-likes', data.newLikes);
		}
	});

	socket.on('notif', (notif) => {
		const recipientSocketId = onlineUsers.get(notif.receiverId);
		if (recipientSocketId) {
			io.to(recipientSocketId).emit('new-notif', notif.newNotifs);
		}
	});

	socket.on('notif-count', (count) => {
		const recipientSocketId = onlineUsers.get(count.receiverId);
		if (recipientSocketId) {
			io.to(recipientSocketId).emit('new-count', count.notifCount);
		}
	});

	socket.on('message-count', (count) => {
		const recipientSocketId = onlineUsers.get(count.receiverId);
		if (recipientSocketId) {
			io.to(recipientSocketId).emit('new-msgCount', count.msgCount);
		}
	});

	// NOTE: THIS IS NOT WORKING!!!
	socket.on('newNotif-messages', (count) => {
		const recipientSocketId = onlineUsers.get(count.receiverId);
		if (recipientSocketId) {
			io.to(recipientSocketId).emit('new-notifMsg', count.newMessages);
		}
	});
});
