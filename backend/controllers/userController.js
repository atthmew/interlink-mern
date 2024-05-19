const User = require('../models/userModel');
const bcrypt = require('bcrypt');

module.exports.register = async (req, res, next) => {
	try {
		const { email, fullName, password } = req.body;

		const nameValidation = await User.findOne({ fullName });
		if (nameValidation) {
			return res.json({ message: 'Name already used.', status: false });
		}

		const emailValidation = await User.findOne({ email });
		if (emailValidation) {
			return res.json({ message: 'Email already used.', status: false });
		}

		const hashedPassword = await bcrypt.hash(password, 10);

		const user = await User.create({
			email: email,
			fullName: fullName,
			password: hashedPassword,
		});

		delete user.password;
		return res.json({ status: true, user: user });
	} catch (ex) {
		next(ex);
	}
};

module.exports.login = async (req, res, next) => {
	try {
		const { email, password } = req.body;

		const user = await User.findOne({ email });
		if (!user) {
			return res.json({ message: 'Email or Password is incorrect', status: false });
		}

		const isPasswordCorrect = await bcrypt.compare(password, user.password);
		if (!isPasswordCorrect) {
			return res.json({ message: 'Email or Password is incorrect', status: false });
		}

		delete user.password;
		return res.json({ status: true, user: user });
	} catch (ex) {
		next(ex);
	}
};

module.exports.setProfilePic = async (req, res, next) => {
	try {
		const id = req.params.id;
		const image = req.body.image;

		const userData = await User.findByIdAndUpdate(id, {
			profilePic: image,
			isProfilePicSet: true,
		});

		return res.json({ isSet: true, user: userData });
	} catch (ex) {
		next(ex);
	}
};

module.exports.getAllUsers = async (req, res, next) => {
	try {
		currentUserId = req.params.id;

		const users = await User.find({ _id: { $ne: currentUserId } }).select(['email', 'fullName', 'profilePic', '_id']);

		return res.json({ status: true, data: users });
	} catch (ex) {
		next(ex);
	}
};

module.exports.getNotif = async (req, res, next) => {
	try {
		const userName = req.params.name;
		const toFind = { fullName: userName };

		const user = await User.findOne(toFind);

		if (user && user.notifications.length !== 0) {
			const unreadCount = user.notifications.filter((notification) => !notification.isRead).length;

			return res.json({
				status: true,
				data: user.notifications,
				unreadCount: unreadCount,
			});
		} else {
			return res.json({ status: false, message: 'No notifications found or user does not exist.' });
		}
	} catch (ex) {
		next(ex);
	}
};

module.exports.readNotif = async (req, res, next) => {
	try {
		const { currentName, currentId } = req.body;
		const toFind = { fullName: currentName };

		// Step 1: Fetch the user to count unread notifications
		const user = await User.findOne(toFind);
		if (!user) {
			return res.json({
				status: false,
				message: 'User does not exist.',
			});
		}

		const unreadCount = user.notifications.filter((notification) => !notification.isRead).length;

		// Step 2: Update notifications to mark them as read if there are any unread
		if (unreadCount > 0) {
			await User.updateOne(toFind, { $set: { 'notifications.$[].isRead': true } });
		}

		// Step 3: Return the count of notifications marked as read
		return res.json({
			status: true,
			message: 'All notifications marked as read.',
			updatedNotificationsCount: unreadCount,
			currentId,
		});
	} catch (ex) {
		next(ex);
	}
};

module.exports.getUser = async (req, res, next) => {
	try {
		const userId = req.params.userId;
		console.log(userId);

		const currentUser = await User.findById(userId);

		return res.json({ status: true, data: currentUser });
	} catch (ex) {
		next(ex);
	}
};

module.exports.searchUser = async (req, res, next) => {
	try {
		const searchInput = req.params.search;
		const users = await User.find({ fullName: { $regex: new RegExp(searchInput, 'i') } });

		if (users.length !== 0) {
			res.status(200).json({ status: true, data: users });
		} else {
			res.status(200).json({ status: false });
		}
	} catch (ex) {
		next(ex);
	}
};
