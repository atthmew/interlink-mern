const mongoose = require('mongoose');

const postSchema = new mongoose.Schema(
	{
		image: {
			type: String,
		},

		caption: {
			type: String,
		},

		fullName: {
			type: String,
		},

		authorPic: {
			type: String,
		},
		authorId: {
			type: String,
		},

		dateCreated: {
			type: String,
			default: Date.now(),
		},

		comments: [
			{
				commentorData: {},
				comment: String,
			},
		],

		likes: [
			{
				likerData: {},
				like: Boolean,
			},
		],
	},

	{
		timestamps: true,
	}
);

module.exports = mongoose.model('InterLink Posts', postSchema);
