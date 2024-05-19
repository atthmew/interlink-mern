import React, { useEffect, useRef, useState } from 'react';

import styled from 'styled-components';

import samplePic from '../assets/sample.jpg';
import { AiOutlineSend } from 'react-icons/ai';
import { themeDark } from '../utils/theme';
import { useDispatch, useSelector } from 'react-redux';
import { addComment, getComments } from '../store/slices/userPostsSlics';

import { io } from 'socket.io-client';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { autoCloseOption, toastifyOption } from '../utils/toastifyOption';

const socket = io('http://localhost:61723', {
	reconnection: true,
});

const CommentSection = ({ showCommentSection, userDetails, authorName, postId, profilePic, authorId, comments }) => {
	const [comment, setComment] = useState('');
	const [allComments, setAllComments] = useState([]);
	const dispatch = useDispatch();
	const rawData = localStorage.getItem('interlink-userData');
	const userData = JSON.parse(rawData);

	const onCommentChange = (e) => {
		setComment(e.target.value);
	};

	useEffect(() => {
		setAllComments(comments);
	}, [comments]);

	useEffect(() => {
		const fetchComment = async () => {
			try {
				if (showCommentSection) {
					const response = await dispatch(getComments({ postId }));
					setAllComments(response.payload.data || []);
					setComment('');
				}
			} catch (err) {
				console.log(`Error fetching comments: ${err}`);
			}
		};
		fetchComment();
	}, [dispatch, postId, showCommentSection]);

	const commentValidation = () => {
		if (comment === '') {
			toast.dismiss();
			toast.error('Please enter comment before submitting', toastifyOption);
			return false;
		}

		return true;
	};

	const submitComent = (e) => {
		e.preventDefault();
		if (commentValidation()) {
			dispatch(
				addComment({
					postId,
					commentorData: userDetails,
					currentUserId: userDetails._id,
					comment,
					authorName,
					authorId,
				})
			).then((response) => {
				if (response.payload.status) {
					console.log(response.payload.authorId);
					console.log(response);
					socket.emit('comment', {
						newComments: response.payload.data.comments,
						receiverId: response.payload.currentUserId,
					});
					if (response.payload.newNotifs) {
						socket.emit('notif', { newNotifs: response.payload.newNotifs, receiverId: response.payload.authorId });
						socket.emit('notif-count', {
							notifCount: response.payload.notifCount,
							receiverId: response.payload.authorId,
						});
					}
					setComment('');
					toast.dismiss();
					toast.success('Comment Added Successfully', toastifyOption);
				}
			});
		}
	};

	return (
		<Container showCommentSection={showCommentSection}>
			<div className="comment-section">
				<form className="my-comment" onSubmit={submitComent}>
					<img src={`data:image/svg+xml;base64,${profilePic}`} alt="profile-pic" />
					<input type="text" value={comment} placeholder="Write a comment..." onChange={onCommentChange} />
					<AiOutlineSend onClick={submitComent} />
				</form>

				{allComments.map((commentData, index) => (
					<>
						<div key={index} className="comment-info">
							<img src={`data:image/svg+xml;base64,${commentData.commentorData.profilePic}`} alt="profile-pic" />
							<h2>{commentData.commentorData.fullName}</h2>
						</div>
						<div className="comment">
							<p>{commentData.comment}</p>
							<div className="interactions">
								<h5>Like</h5>
								<h4>{commentData.timestamp}</h4>
							</div>
						</div>
					</>
				))}
			</div>
		</Container>
	);
};

export default CommentSection;
const Container = styled.div`
	.comment-section {
		display: ${({ showCommentSection }) => (!showCommentSection ? 'none' : 'flex')};
		width: 100%;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		padding: 0.5rem 1rem;

		.my-comment {
			display: flex;
			width: 120%;
			gap: 1rem;
			padding-bottom: 1rem;
			position: relative;
			img {
				width: 3rem;
				height: 2.5rem;
				border-radius: 50%;
				border: 3px solid ${themeDark.primary};
				transition: 0.3s ease-in-out;
				cursor: pointer;
			}

			input {
				width: 100%;
				background-color: ${themeDark.background};
				border: none;
				border-radius: 1rem;
				padding: 0.5rem;
				color: ${themeDark.text};

				&:focus {
					outline: none;
				}
			}

			svg {
				position: absolute;
				right: 0.5rem;
				top: 0.6rem;
				font-size: 1.2rem;
				color: ${themeDark.accent};
				&:hover,
				&:active {
					cursor: pointer;
				}
			}
		}

		.comment-info {
			display: flex;
			align-items: center;
			gap: 0.5rem;
			align-self: flex-start;
			padding-bottom: 0.5rem;
			padding-top: 1.5rem;

			img {
				width: 3rem;
				height: 3rem;
				border-radius: 50%;
				border: 3px solid ${themeDark.primary};
				transition: 0.3s ease-in-out;
				cursor: pointer;
			}
			h2 {
				font-size: 1rem;
				font-weight: 600;
				letter-spacing: 1.1px;
				border-bottom: 1px solid transparent;
				&:hover,
				&:active {
					border-bottom: 1px solid ${themeDark.accent};
					cursor: pointer;
				}
			}
		}

		.comment {
			display: flex;
			justify-content: center;
			width: 90%;
			flex-direction: column;
			gap: 0.5rem;
			padding-bottom: 2rem;
			color: ${themeDark.text};

			p {
				padding: 1rem;
				background-color: #090707;
				border-radius: 1rem;
				font-weight: 400;
			}

			.interactions {
				display: flex;
				align-items: center;
				gap: 0.5rem;
				h5 {
					font-size: 1rem;
					border-bottom: 1px solid transparent;
					transition: 0.3s ease-in-out;
					&:hover,
					&:active {
						cursor: pointer;
						border-bottom: 1px solid ${themeDark.primary};
					}
				}

				h4 {
					opacity: 0.5;
				}
			}
		}

		.comment:last-child {
			padding-bottom: 0;
		}

		.new-comment {
			color: ${themeDark.text};
			input {
				border: none;
				background-color: transparent;
				font-size: 1rem;
				color: ${themeDark.text};
				border-bottom: 0.1rem solid ${themeDark.primary};
				text-align: center;
				&:focus {
					outline: none;
				}
			}
		}
	}
`;
