import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { themeDark } from '../utils/theme';

import { useNavigate } from 'react-router-dom';

import samplePic from '../assets/sample.jpg';

import Loading from '../components/Loading';
import Post from '../components/Post';
import Navbar from '../components/Navbar';
import NewPost from '../components/NewPost';

import { useDispatch, useSelector } from 'react-redux';
import { setUserData } from '../store/slices/userAuthSlice';
import { getAllPosts, getNotif } from '../store/slices/userPostsSlics';

import { io } from 'socket.io-client';
import { getMessageNotif } from '../store/slices/messageSlice';
import { toast } from 'react-toastify';
const socket = io('http://localhost:61723', {
	reconnection: true,
});

const Home = () => {
	const [isLoading, setIsLoading] = useState(true);
	const [showNewPost, setShowNewPost] = useState(false);
	const [allPosts, setPosts] = useState([]);
	const posts = useSelector((state) => state.userPosts.posts);
	const [notifications, setNotifications] = useState([]);
	const [notifCount, setNotifCount] = useState(0);
	const [messageCount, setMessageCount] = useState(0);
	const [openCommentPostId, setOpenCommentPostId] = useState(null);
	const [allComments, setAllComments] = useState([]);
	const [allLikes, setAllLikes] = useState([]);

	const rawData = localStorage.getItem('interlink-userData');
	const userData = JSON.parse(rawData);

	const navigate = useNavigate();
	const dispatch = useDispatch();

	useEffect(() => {
		const checkIfLoggedIn = async () => {
			const storedUserData = localStorage.getItem('interlink-userData');
			if (!storedUserData) {
				navigate('/login');
			} else {
				const userData = JSON.parse(storedUserData);
				if (userData.isProfilePicSet === false) {
					navigate('/setProfilePic');
				}
				dispatch(setUserData(JSON.parse(storedUserData)));
				setIsLoading(false);
				toast.dismiss();
			}
		};

		checkIfLoggedIn();
	}, []);

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

	useEffect(() => {}, []);

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

	useEffect(() => {
		if (userData) {
			dispatch(getMessageNotif({ currentUserId: userData._id })).then((response) => {
				console.log(response.payload.count);
				if (response.payload.status) {
					setMessageCount(response.payload.count);
				}
			});
		}
	}, [userData]);

	const showNewPostHandler = () => {
		setShowNewPost(!showNewPost);
		window.scrollTo({
			top: 0,
			behavior: 'smooth',
		});
	};

	const newNotificationData = (data) => {
		console.log(data);
	};

	useEffect(() => {
		dispatch(getAllPosts());
	}, []);

	useEffect(() => {
		if (posts && posts.status === true) {
			setPosts([...posts.data]);
		} else {
			console.error('Posts data is not in the expected format.');
		}
	}, [posts]);

	const toggleCommentSection = (postId) => {
		if (openCommentPostId === postId) {
			setOpenCommentPostId(null);
		} else {
			setOpenCommentPostId(postId);
		}
	};

	return (
		<>
			{isLoading ? (
				<Loading />
			) : (
				<Container>
					<Navbar
						notifications={notifications}
						notifCount={notifCount}
						userData={userData}
						option="post"
						showPost={showNewPostHandler}
						messageCount={messageCount}
					/>

					<NewPost userData={userData} showPost={showNewPost} />

					<div className="main-container">
						{allPosts
							.map((post) => (
								<Post
									key={post._id}
									currentUser={userData}
									showCommentSection={openCommentPostId === post._id}
									onToggleComment={() => toggleCommentSection(post._id)}
									id={post._id}
									name={post.fullName}
									profilePic={post.authorPic}
									caption={post.caption}
									createdAt={post.createdAt}
									image={post.image}
									newNotif={newNotificationData}
									authorId={post.authorId}
									comments={allComments}
									likes={allLikes}
								/>
							))
							.reverse()}
					</div>
				</Container>
			)}
		</>
	);
};

export default Home;

const Container = styled.div`
	background-color: ${themeDark.background};
	position: relative;

	.main-container {
		display: flex;
		align-items: center;
		justify-content: center;
		overflow: auto;
		flex-direction: column;
	}
`;
