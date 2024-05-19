import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { findPosts, getComments, getLikes, getNotif, getPost, getUser } from '../store/slices/userPostsSlics';
import Post from '../components/Post';
import styled from 'styled-components';
import { themeDark } from '../utils/theme';
import Navbar from '../components/Navbar';

import { io } from 'socket.io-client';
const socket = io('http://localhost:61723', {
	reconnection: true,
});

const UserPage = () => {
	const { userId } = useParams();
	const [currentUserData, setCurrentUserdata] = useState({});
	const [openCommentPostId, setOpenCommentPostId] = useState(null);
	const [currentPosts, setCurrentPosts] = useState([]);
	const [isLiked, setIsLiked] = useState(false);
	const [showAllLikes, setShowAllLikes] = useState(false);
	const [allLikes, setAllLikes] = useState([]);
	const [comment, setComment] = useState('');
	const [allComments, setAllComments] = useState([]);
	const [notifications, setNotifications] = useState([]);
	const [notifCount, setNotifCount] = useState(0);
	const [showNewPost, setShowNewPost] = useState(false);
	const [messageCount, setMessageCount] = useState(0);

	const rawData = localStorage.getItem('interlink-userData');
	const userData = JSON.parse(rawData);

	const dispatch = useDispatch();
	const navigate = useNavigate();

	useEffect(() => {
		if (userData) {
			socket.emit('add-user', userData._id);
		}

		socket.on('new-count', (newCount) => {
			setNotifCount(newCount);
		});
		socket.on('new-notif', (newNotif) => {
			setNotifications(newNotif);
		});

		socket.on('new-msgCount', (newMsg) => {
			setMessageCount(newMsg);
		});

		socket.on('new-comments', (newComment) => {
			setAllComments(newComment);
		});

		socket.on('new-likes', (newLikes) => {
			setAllLikes(newLikes);
		});
	}, []);

	useEffect(() => {
		dispatch(getUser({ userId })).then((response) => {
			if (response.payload.status) {
				setCurrentUserdata(response.payload.data);
			}
		});
	}, [userId]);

	useEffect(() => {
		dispatch(findPosts({ authorId: userId })).then((response) => {
			if (response.payload.status) {
				setCurrentPosts(response.payload.data);
			}
		});
	}, [currentUserData]);

	const toggleCommentSection = (postId) => {
		if (openCommentPostId === postId) {
			setOpenCommentPostId(null);
		} else {
			setOpenCommentPostId(postId);
		}
	};

	// useEffect(() => {
	// 	dispatch(getLikes({ postId: postId })).then((response) => {
	// 		const likes = response.payload.likes;
	// 		const likesArray = Array.isArray(response.payload.likes) ? response.payload.likes : [];
	// 		const isUserLiked = likesArray.some((like) => like.likerData.fullName === userData.fullName);

	// 		setAllLikes(likes);
	// 		setIsLiked(isUserLiked);
	// 	});
	// }, [dispatch, postId, userData.full_name, showAllLikes]);

	// useEffect(() => {
	// 	const fetchComment = async () => {
	// 		try {
	// 			const response = await dispatch(getComments({ postId }));
	// 			setAllComments(response.payload.data || []);
	// 			setComment('');
	// 		} catch (err) {
	// 			console.log(`Error fetching comments: ${err}`);
	// 		}
	// 	};
	// 	fetchComment();
	// }, [dispatch, postId]);

	const fullName = userData?.fullName;
	useEffect(() => {
		if (fullName) {
			dispatch(getNotif({ currentUser: fullName })).then((response) => {
				if (response.payload.data) {
					setNotifCount(response.payload.unreadCount);
					setNotifications(response.payload.data);
				}
			});
		} else {
			navigate('/login');
		}
	}, [fullName, dispatch, navigate]);

	const showNewPostHandler = () => {
		setShowNewPost(!showNewPost);
		window.scrollTo({
			top: 0,
			behavior: 'smooth',
		});
	};

	return (
		<>
			<Navbar
				notifications={notifications}
				notifCount={notifCount}
				userData={userData}
				option="home"
				showPost={showNewPostHandler}
				messageCount={messageCount}
			/>
			<Container>
				<div className="main-container">
					<div className="detail-container">
						<div className="profile-pic">
							<img src={`data:image/svg+xml;base64,${currentUserData.profilePic}`} alt="profile-pic" />
						</div>

						<div className="info">
							<h3>{currentUserData.fullName}</h3>
						</div>
					</div>

					{currentPosts.length !== 0 ? (
						currentPosts.map((postData) => (
							<Post
								className="posts"
								currentUser={userData}
								showCommentSection={openCommentPostId === postData._id}
								onToggleComment={() => toggleCommentSection(postData._id)}
								id={postData._id}
								name={postData.fullName}
								profilePic={postData.authorPic}
								caption={postData.caption}
								createdAt={postData.createdAt}
								image={postData.image}
								authorId={postData.authorId}
								comments={allComments}
								likes={allLikes}
							/>
						))
					) : (
						<h1 className="no-post">No Post Available Yet</h1>
					)}
				</div>
			</Container>
		</>
	);
};

export default UserPage;
const Container = styled.div`
	background-color: ${themeDark.background};
	position: relative;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	.main-container {
		display: flex;
		align-items: center;
		justify-content: center;
		overflow: auto;
		flex-direction: column;
		margin-top: 2rem;
		border-radius: 0.5rem;
		width: 100%;
		.detail-container {
			padding: 2rem;
			margin-bottom: 4rem;
			top: 1rem;
			left: 1rem;
			display: flex;
			justify-content: center;
			width: 90%;
			align-items: center;
			gap: 3rem;
			background-color: ${themeDark.secondaryBackgound};

			.profile-pic {
				img {
					width: 10rem;
					height: 10rem;
					border-radius: 50%;
					border: 9px solid ${themeDark.primary};
					transition: 0.3s ease-in-out;
					&:hover,
					&:active {
						border: 9px solid ${themeDark.accent};
						cursor: pointer;
					}
				}
			}
			.info {
				display: flex;
				flex-direction: column;
				gap: 0.2rem;
				color: ${themeDark.accent};
				text-decoration: none;
				h3 {
					font-size: 3rem;
					letter-spacing: 4px;
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
		.no-post {
			color: ${themeDark.accent};
		}
	}
`;
