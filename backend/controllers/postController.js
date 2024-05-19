const Post = require('../models/postModel');
const User = require('../models/userModel');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;

const storage = multer.memoryStorage();

module.exports.newPost = async (req, res, next) => {
	try {
		const { caption, fullName, profilePic, authorId } = req.body;

		if (!req.file) {
			const data = await Post.create({
				caption,
				fullName,
				authorPic: profilePic,
				authorId,
			});

			return res.json({ status: true, data });
		} else {
			const imageBuffer = req.file.buffer;
			// Save the image data to a file
			const uploadPath = path.join(__dirname, '../uploads'); // Change this to your desired upload directory
			const fileName = `${fullName}_post_${Date.now()}.jpg`; // You can customize the file name as needed
			const filePath = path.join(uploadPath, fileName);

			// Create the directory if it doesn't exist
			await fs.mkdir(uploadPath, { recursive: true });

			// Use fs.writeFile to save the image buffer to a file
			await fs.writeFile(filePath, imageBuffer);

			// const image = req.file.buffer.toString('base64');
			const data = await Post.create({
				caption,
				image: fileName,
				fullName,
				authorPic: profilePic,
				authorId,
			});

			return res.json({ status: true, data });
		}
	} catch (ex) {
		next(ex);
	}
};

module.exports.getAllPost = async (req, res, next) => {
	try {
		const posts = await Post.find();
		return res.json({ status: true, data: posts });
	} catch (ex) {
		console.log(`Error fetching posts, ${ex}`);
		next(ex);
	}
};

module.exports.addComment = async (req, res, next) => {
	try {
		const { postId, commentorData, comment, authorName, authorId, currentUserId } = req.body;
		let notif = null;
		let notifCount = 0;

		const updatedPost = await Post.findByIdAndUpdate(
			postId,
			{ $push: { comments: { commentorData, comment } } },
			{ new: true }
		);

		if (commentorData.fullName !== authorName) {
			const toFind = { fullName: authorName };
			const newNotif = await User.findOneAndUpdate(
				toFind,
				{
					$push: { notifications: { notification: 'Comment', notifierData: commentorData, postId } },
				},
				{ new: true }
			);
			const user = await User.findOne(toFind);
			if (user && user.notifications.length !== 0) {
				const unreadCount = user.notifications.filter((notification) => !notification.isRead).length;
				notifCount = unreadCount;
			}

			notif = newNotif.notifications;
		} else {
			return res.json({ status: true, data: updatedPost, authorId, currentUserId });
		}

		return res.json({
			status: true,
			data: updatedPost,
			newNotifs: notif,
			notifCount: notifCount,
			authorId,
			currentUserId,
		});
	} catch (ex) {
		next(ex);
	}
};

module.exports.getComments = async (req, res, next) => {
	try {
		const id = req.params.id;
		const post = await Post.findOne({ _id: id });
		const comments = post.comments;

		return res.json({ status: true, data: comments });
	} catch (ex) {
		console.log(`Error fetching comments, ${ex}`);
		next(ex);
	}
};

module.exports.likePost = async (req, res, next) => {
	try {
		const { postId, likerData, authorName, authorId, currentUserId } = req.body;
		let notif = null;
		let notifCount = 0;

		const post = await Post.findById(postId);

		const hasLiked = post.likes.some((like) => like.likerData.email === likerData.email);

		if (hasLiked) {
			return res.json({ status: false, message: 'You already liked this post.' });
		} else if (!hasLiked) {
			const updatedPost = await Post.findByIdAndUpdate(
				postId,
				{ $push: { likes: { likerData, like: true } } },
				{ new: true }
			);

			if (likerData.fullName !== authorName) {
				const toFind = { fullName: authorName };
				const newNotif = await User.findOneAndUpdate(
					toFind,
					{
						$push: { notifications: { notification: 'Like', notifierData: likerData, postId } },
					},
					{ new: true }
				);

				const user = await User.findOne(toFind);
				if (user && user.notifications.length !== 0) {
					const unreadCount = user.notifications.filter((notification) => !notification.isRead).length;
					notifCount = unreadCount;
				}

				notif = newNotif.notifications;
			} else {
				return res.json({ status: true, data: updatedPost, authorId, currentUserId });
			}
			return res.json({
				status: true,
				data: updatedPost,
				newNotifs: notif,
				notifCount: notifCount,
				authorId,
				currentUserId,
			});
		}
	} catch (ex) {
		next(ex);
	}
};

module.exports.getLikes = async (req, res, next) => {
	try {
		const postId = req.params.id;
		const post = await Post.findOne({ _id: postId });
		const likes = post.likes;

		return res.json({ status: true, likes: likes });
	} catch (ex) {
		next(ex);
	}
};

module.exports.getPost = async (req, res, next) => {
	try {
		const postId = req.params.postId;

		const currentPost = await Post.findById(postId);

		return res.json({ status: true, data: currentPost });
	} catch (ex) {
		next(ex);
	}
};

module.exports.findPosts = async (req, res, next) => {
	try {
		const { authorId } = req.body;
		const toFind = { authorId: authorId };

		const currentPosts = await Post.find(toFind);

		return res.json({ status: true, data: currentPosts });
	} catch (ex) {
		next(ex);
	}
};
