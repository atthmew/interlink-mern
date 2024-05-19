import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { getComments, getLikes, getNotif, getPost } from '../store/slices/userPostsSlics';
import Post from '../components/Post';
import styled from 'styled-components';
import { themeDark } from '../utils/theme';
import Navbar from '../components/Navbar';
const CurrentPost = () => {
	const { postId } = useParams();
	const [postData, setPostData] = useState({});
	const [openCommentPostId, setOpenCommentPostId] = useState(null);
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
		dispatch(getPost({ postId })).then((response) => {
			if (response.payload.status) {
				setPostData(response.payload.data);
			}
		});
	}, [postId]);

	const toggleCommentSection = (postId) => {
		if (openCommentPostId === postId) {
			setOpenCommentPostId(null);
		} else {
			setOpenCommentPostId(postId);
		}
	};

	useEffect(() => {
		dispatch(getLikes({ postId: postId })).then((response) => {
			const likes = response.payload.likes;
			const likesArray = Array.isArray(response.payload.likes) ? response.payload.likes : [];
			const isUserLiked = likesArray.some((like) => like.likerData.fullName === userData.fullName);

			setAllLikes(likes);
			setIsLiked(isUserLiked);
		});
	}, [dispatch, postId, userData.full_name, showAllLikes]);

	useEffect(() => {
		const fetchComment = async () => {
			try {
				const response = await dispatch(getComments({ postId }));
				setAllComments(response.payload.data || []);
				setComment('');
			} catch (err) {
				console.log(`Error fetching comments: ${err}`);
			}
		};
		fetchComment();
	}, [dispatch, postId]);

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
		<Container>
			<Navbar
				notifications={notifications}
				notifCount={notifCount}
				userData={userData}
				option="home"
				showPost={showNewPostHandler}
				messageCount={messageCount}
			/>
			<div className="main-container">
				<Post
					currentUser={userData}
					showCommentSection={openCommentPostId === postData._id}
					onToggleComment={() => toggleCommentSection(postData._id)}
					id={postId}
					name={postData.fullName}
					profilePic={postData.authorPic}
					caption={postData.caption}
					createdAt={postData.createdAt}
					image={postData.image}
					authorId={postData.authorId}
					comments={allComments}
					likes={allLikes}
				/>
			</div>
		</Container>
	);
};

export default CurrentPost;
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
