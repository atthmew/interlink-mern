const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
	email: {
		type: String,
		required: true,
		unique: true,
	},

	fullName: {
		type: String,
		required: true,
		unique: true,
		min: 6,
	},

	password: {
		type: String,
		required: true,
		min: 8,
	},

	isProfilePicSet: {
		type: Boolean,
		default: false,
		required: true,
	},

	profilePic: {
		type: String,
		default: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png',
		required: true,
	},

	notifications: [
		{
			notification: String,
			notifierData: {},
			isRead: {
				type: Boolean,
				default: false,
			},
			postId: {
				type: mongoose.Schema.Types.ObjectId,
				ref: 'InterLink Posts',
			},
			// NOTE: user findOneAndUpdate to push the notification to the user
		},
	],
});

module.exports = mongoose.model('InterLink Users', userSchema);
