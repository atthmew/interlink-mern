const Message = require('../models/messageModel');

module.exports.sendMessage = async (req, res, next) => {
	try {
		const { from, to, message } = req.body;
		const data = await Message.create({
			message: { text: message },
			users: [from, to],
			sender: from,
		});
		const messages = await Message.find({
			users: { $elemMatch: { $eq: to } }, // Ensures the user is in the 'users' array
			sender: { $ne: to }, // Ensures the user is not the sender
			isRead: false, // Only retrieves unread messages
		});

		const count = messages.length;

		const newMessages = await Message.find({
			users: { $elemMatch: { $eq: to } }, // Ensures the user is in the 'users' array
			sender: { $ne: to }, // Ensures the user is not the sender
			isRead: false, // Only counts unread messages
		});

		if (data) {
			return res.json({ status: true, count: count, newMessages });
		} else {
			return res.json({ status: false, msg: 'Failed to send chat, try again later.' });
		}
	} catch (ex) {
		next(ex);
	}
};

module.exports.getAllMessage = async (req, res, next) => {
	try {
		const { from, to } = req.body;
		const messages = await Message.find({
			users: {
				$all: [from, to],
			},
		}).sort({ updatedAt: 1 });
		9;
		const projectedMessages = messages.map((msg) => {
			return {
				fromSelf: msg.sender.toString() === from,
				message: msg.message.text,
			};
		});

		return res.json(projectedMessages);
	} catch (ex) {
		next(ex);
	}
};

module.exports.getMessageNotif = async (req, res, next) => {
	try {
		const { currentUserId } = req.body;

		const count = await Message.countDocuments({
			users: { $elemMatch: { $eq: currentUserId } }, // Ensures the user is in the 'users' array
			sender: { $ne: currentUserId }, // Ensures the user is not the sender
			isRead: false, // Only counts unread messages
		});

		return res.json({ status: true, count: count, currentUserId });
	} catch (ex) {
		next(ex);
	}
};

module.exports.newMessages = async (req, res, next) => {
	try {
		const { currentUserId } = req.body;

		const newMessages = await Message.find({
			users: { $elemMatch: { $eq: currentUserId } }, // Ensures the user is in the 'users' array
			sender: { $ne: currentUserId }, // Ensures the user is not the sender
			isRead: false, // Only counts unread messages
		});

		return res.json({ status: true, newMessages });
	} catch (ex) {
		next(ex);
	}
};

module.exports.readMessage = async (req, res, next) => {
	try {
		const { currentUserId, currentChatId } = req.body;

		const result = await Message.updateMany(
			{
				'users.0': currentChatId, // currentChatId must be the first user
				'users.1': currentUserId, // currentUserId must be the second user
				isRead: false, // Only targets unread messages
			},
			{
				$set: { isRead: true }, // Sets isRead to true for all matched documents
			}
		);
	} catch (ex) {
		next(ex);
	}
};
