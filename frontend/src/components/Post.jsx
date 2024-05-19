import React, { useEffect, useState } from 'react';

import samplePic from '../assets/sample.jpg';
import sampleContent from '../assets/we.jpg';

import styled from 'styled-components';
import { themeDark } from '../utils/theme';

import { AiOutlineSend } from 'react-icons/ai';
import CommentSection from './CommentSection';

import { useSelector, useDispatch } from 'react-redux';
import { getAllPosts, getComments, getLikes, likePost } from '../store/slices/userPostsSlics';
import Likes from './Likes';
import { toast } from 'react-toastify';
import { toastifyOption } from '../utils/toastifyOption';
import { io } from 'socket.io-client';
import { Link } from 'react-router-dom';

const socket = io('http://localhost:61723', {
	reconnection: true,
});

const Post = ({
	name,
	caption,
	image,
	profilePic,
	id,
	currentUser,
	showCommentSection,
	onToggleComment,
	newNotif,
	authorId,
	comments,
	likes,
}) => {
	const [isLiked, setIsLiked] = useState(false);
	const [showAllLikes, setShowAllLikes] = useState(false);
	const [allLikes, setAllLikes] = useState([]);
	const { notifications, ...userDetails } = currentUser;

	useEffect(() => {
		setAllLikes(likes);
	}, [likes]);

	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(getLikes({ postId: id })).then((response) => {
			if (response.payload.status) {
				const likes = response.payload.likes;
				const likesArray = Array.isArray(response.payload.likes) ? response.payload.likes : [];
				const isUserLiked = likesArray.some((like) => like.likerData.fullName === currentUser.fullName);
				setAllLikes(likes);
				setIsLiked(isUserLiked);
			}
		});
	}, [dispatch, id, currentUser.full_name, showAllLikes]);

	const likeButtonHandler = () => {
		if (!isLiked) {
			dispatch(
				likePost({ postId: id, likerData: userDetails, authorName: name, authorId, currentUserId: userDetails._id })
			).then((response) => {
				if (response.payload.status) {
					console.log(response);
					socket.emit('like', { newLikes: response.payload.data.likes, receiverId: response.payload.currentUserId });
					if (response.payload.newNotifs) {
						socket.emit('notif', { newNotifs: response.payload.newNotifs, receiverId: response.payload.authorId });
						socket.emit('notif-count', {
							notifCount: response.payload.notifCount,
							receiverId: response.payload.authorId,
						});
					}
					toast.dismiss();
					toast.success('Post Liked Successfully', toastifyOption);
					setIsLiked(true);
				}
			});
		} else {
			toast.dismiss();
			toast.error('You already Liked this Post', toastifyOption);
		}
	};

	const showLikesHandler = () => {
		setShowAllLikes(true);
	};
	return (
		<Container>
			{showAllLikes && <Likes likes={allLikes} showIt={showAllLikes} onClose={() => setShowAllLikes(false)} />}
			{image ? (
				<div className="post-container">
					<div className="details-container">
						<div className="profile-pic">
							<Link to={`/user/${authorId}`}>
								<img src={`data:image/svg+xml;base64,${profilePic}`} alt="profile-pic" />
							</Link>
						</div>
						<div className="info">
							<Link to={`/user/${authorId}`}>
								<h3>{name}</h3>
							</Link>
						</div>
					</div>

					<div className="content-container">
						<div className="post-details">
							<p>{caption}</p>
						</div>
						<div className="post-image">
							<img src={`http://localhost:61723/uploads/${image}`} alt="content" />
						</div>
					</div>

					<div className="interactions-container">
						<button className={isLiked ? 'liked' : 'not-liked'} onClick={likeButtonHandler}>
							Like
						</button>
						<button onClick={onToggleComment}>Comment</button>
					</div>

					<div className="likes" onClick={showLikesHandler}>
						<p>Show Likes</p>
					</div>

					<CommentSection
						showCommentSection={showCommentSection}
						userDetails={userDetails}
						authorName={name}
						postId={id}
						profilePic={currentUser.profilePic}
						authorId={authorId}
						comments={comments}
					/>
				</div>
			) : (
				<div className="post-container">
					<div className="details-container">
						<div className="profile-pic">
							<Link to={`user/${authorId}`}>
								<img src={`data:image/svg+xml;base64,${profilePic}`} alt="profile-pic" />
							</Link>
						</div>

						<div className="info">
							<Link to={`user/${authorId}`}>
								<h3>{name}</h3>
							</Link>
						</div>
					</div>

					<div className="content-container">
						<div className="post-image">
							<div className="no-caption">
								<h1>{caption}</h1>
							</div>
						</div>
					</div>

					<div className="interactions-container">
						<button className={isLiked ? 'liked' : 'not-liked'} onClick={likeButtonHandler}>
							Like
						</button>
						<button onClick={onToggleComment}>Comment</button>
					</div>

					<div className="likes" onClick={showLikesHandler}>
						<p>Show Likes</p>
					</div>

					<CommentSection
						showCommentSection={showCommentSection}
						userDetails={userDetails}
						authorName={name}
						postId={id}
						profilePic={currentUser.profilePic}
						authorId={authorId}
						comments={comments}
					/>
				</div>
			)}
		</Container>
	);
};

export default Post;
const Container = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	width: 70%;
	.post-container {
		display: flex;
		align-items: center;
		margin: 2rem 0;
		justify-content: center;
		flex-direction: column;
		background-color: ${themeDark.secondaryBackgound};
		gap: 1rem;
		color: ${themeDark.text};
		padding: 2rem 2rem;
		position: relative;
		transition: 0.3s all;
		width: 60%;
		max-width: 100%;
		border-radius: 0.5rem;
		border: 1px solid transparent;
		&:hover,
		&:active {
			border: 1px solid ${themeDark.primary};
		}
		.details-container {
			position: absolute;
			top: 1rem;
			left: 1rem;
			display: flex;
			justify-content: center;
			align-items: center;
			gap: 1rem;

			.profile-pic {
				img {
					width: 3rem;
					height: 3rem;
					border-radius: 50%;
					border: 3px solid ${themeDark.primary};
					transition: 0.3s ease-in-out;
					&:hover,
					&:active {
						border: 3px solid ${themeDark.accent};
						cursor: pointer;
					}
				}
			}
			.info {
				display: flex;
				flex-direction: column;
				gap: 0.2rem;
				a {
					color: ${themeDark.accent};
					text-decoration: none;
				}
				h3 {
					transition: 0.3s ease-in-out;
					border-bottom: 1px solid transparent;
					&:hover,
					&:active {
						border-bottom: 1px solid ${themeDark.accent};
						cursor: pointer;
					}
				}
				h5 {
					opacity: 0.6;
				}
			}
		}

		.content-container {
			margin-top: 3rem;
			display: flex;
			flex-direction: column;
			justify-content: center;
			gap: 1rem;
			max-width: 25rem;
			width: 100%;
			/* background-color: red */
			.post-details {
			}
			img {
				/* width: 25rem; */
				max-width: 35rem;
				width: 100%;
				/* height: 20rem; */
				min-height: 20rem;
				border-radius: 0.5rem;
			}

			.no-caption {
				display: flex;
				justify-content: center;
				align-items: center;
				text-align: center;
				max-width: 25rem;
				min-height: 20rem;
				border-radius: 0.5rem;
				background-color: ${themeDark.primary};
				h1 {
					white-space: nowrap; /* Prevent text from wrapping */
					overflow: hidden; /* Hide overflowing text */
					text-overflow: ellipsis;
				}
			}
		}

		.interactions-container {
			display: flex;
			align-items: center;
			justify-content: center;
			gap: 15vw;
			button {
				font-size: 1rem;
				padding: 0.5rem 1rem;
				border: none;
				text-transform: uppercase;
				background-color: ${themeDark.accent};
				border-radius: 0.5rem;
				transition: 0.3s ease-in-out;
				&:hover,
				&:active {
					background-color: ${themeDark.primary};
					cursor: pointer;
				}

				&:focus {
					outline: none;
				}
			}
			.liked {
				background-color: ${themeDark.primary};
			}
		}

		.likes {
			display: flex;
			align-items: center;
			justify-content: center;
			p {
				font-size: 1rem;
				text-transform: uppercase;
				letter-spacing: 1px;
				color: ${themeDark.accent};
				transition: 0.2s ease-in-out;
				border-bottom: 2px solid ${themeDark.primary};
				&:hover,
				&:active {
					border-bottom: 2px solid transparent;
					cursor: pointer;
				}
			}
		}
	}

	@media (max-width: 600px) {
		.post-container {
			width: 100%;
		}
	}

	@media (max-width: 768px) {
		.post-container {
			width: 100%;
		}
	}
	/* @media (min-width: 768px) {
		.post-container {
			width: 100%;
		}
	} */

	/* @media (min-wdith: 1200px) {
		.post-container {
			width: 50%;
		}
	} */
`;
