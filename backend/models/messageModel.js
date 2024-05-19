const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema(
	{
		message: {
			text: {
				type: String,
				require: true,
			},
		},

		users: Array,

		sender: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'InterLink Users',
			required: true,
		},

		isRead: {
			type: Boolean,
			default: false,
		},
	},

	{
		timestamps: true,
	}
);

module.exports = mongoose.model('InterLink Messages', messageSchema);
