const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
	cors: {
		origin: 'http://localhost:3000', // React app's URL
		methods: ['GET', 'POST'],
	},
});

let onlineUsers = new Map();

io.on('connection', (socket) => {
	console.log('A user connected');

	socket.on('add-user', (userId) => {
		onlineUsers.set(userId, socket.id);
	});

	socket.on('send-msg', (data) => {
		const sendUserSocket = onlineUsers.get(data.to);
		if (sendUserSocket) {
			socket.to(sendUserSocket).emit('msg-receive', data.message);
		}
	});

	socket.on('new-comment', (commentData) => {
		socket.broadcast.emit('comment-received', commentData);
	});

	socket.on('error', (error) => {
		console.error('Socket error:', error);
	});

	socket.on('disconnect', () => {
		console.log('User disconnected');
		onlineUsers.delete(socket.id); // Remove user from map on disconnect
	});
});

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
