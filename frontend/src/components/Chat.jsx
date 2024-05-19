import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

import { IoMdSend } from 'react-icons/io';

import { themeDark } from '../utils/theme';
import axios from 'axios';
import { toast } from 'react-toastify';
import Welcome from './Welcome';
import { toastifyOption } from '../utils/toastifyOption';
import { useDispatch } from 'react-redux';
import { getAllMessage, getMessageNotif, readMessage, sendMessage } from '../store/slices/messageSlice';
import { getAllMessageRoute } from '../utils/APIRoutes';

const Chat = ({ currentChat, userData, socket }) => {
	const [message, setMessage] = useState('');
	const [messages, setMessages] = useState([]);
	const [arrivalMessage, setArrivalMessage] = useState(null);
	const scrollRef = useRef();

	const dispatch = useDispatch();

	useEffect(() => {
		const fetchChatMessages = async () => {
			if (currentChat && userData) {
				dispatch(getAllMessage({ from: userData._id, to: currentChat._id })).then((response) => {
					setMessages(response.payload);
				});
			}
		};
		fetchChatMessages();
	}, [currentChat]);

	const messageChangeHandler = (e) => {
		setMessage(e.target.value);
	};

	const messageValidation = () => {
		if (message === '') {
			toast.error('Please enter message before submitting', toastifyOption);
			return false;
		}

		return true;
	};
	const sendChatHandler = async (e) => {
		e.preventDefault();

		if (messageValidation()) {
			const messageData = { from: userData._id, to: currentChat._id, message };
			socket.current.emit('send-msg', messageData);
			dispatch(sendMessage({ from: userData._id, to: currentChat._id, message })).then((response) => {
				console.log(response);
				const newMessage = {
					senderId: userData.id,
					receiverId: currentChat.id,
					message: message,
					fromSelf: true,
				};
				setMessages((prevMessages) => [...prevMessages, newMessage]);

				socket.current.emit('send-msg', {
					...newMessage,
					fromSelf: false,
				});

				socket.current.emit('message-count', {
					msgCount: response.payload.count,
					receiverId: currentChat._id,
				});

				socket.current.emit('newNotif-messages', {
					newMessages: response.payload.newMessages,
					receiverId: currentChat._id,
				});

				setMessage('');
				// toast.error(response.payload.status, toastifyOption);
			});
		}
	};

	useEffect(() => {
		if (socket.current) {
			socket.current.on('msg-recieve', (msg) => {
				console.log('Message received:', msg);
				setArrivalMessage(msg);
			});
		}
	}, [socket.current]);

	useEffect(() => {
		if (arrivalMessage) {
			setMessages((prev) => [...prev, arrivalMessage]);
		}
	}, [arrivalMessage]);

	useEffect(() => {
		const currentScrollRef = scrollRef.current;
		currentScrollRef?.scrollIntoView({ behavior: 'smooth' });

		if (currentChat && messages.length > 0) {
			dispatch(readMessage({ currentUserId: userData._id, currentChatId: currentChat._id }));
		}
	}, [messages]);

	return (
		<>
			{currentChat ? (
				<Container>
					<div className="info-container">
						<div className="img">
							<img src={`data:image/svg+xml;base64,${currentChat.profilePic}`} alt="avatar" className="profile-pic" />
						</div>
						<div className="info">
							<h1>{currentChat.fullName}</h1>
						</div>
					</div>
					<div className="chat-container">
						{messages.map((msg, index) => (
							<div
								key={index}
								className={`message ${msg.fromSelf ? 'receiver' : 'sender'}`}
								ref={index === messages.length - 1 ? scrollRef : null}
							>
								<div className="content">{msg.message}</div>
							</div>
						))}
					</div>
					<div className="input-main-container">
						<form className="input-container" onSubmit={sendChatHandler}>
							<input
								type="text"
								value={message}
								placeholder="Type your message here..."
								onChange={messageChangeHandler}
							/>
							<button className="submit">
								<IoMdSend />
							</button>
						</form>
					</div>
				</Container>
			) : (
				<Welcome currentUser={userData} />
			)}
		</>
	);
};

export default Chat;
const Container = styled.div`
	display: flex;
	flex-direction: column;
	height: 100%;
	overflow: hidden;
	.info-container {
		background-color: ${themeDark.secondary};
		height: 20%;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 1.5rem;
		padding: 2rem;
		padding-top: 4rem;
		.info {
			h1 {
				font-size: 2rem;
				letter-spacing: 2px;
				border-bottom: 2px solid transparent;
				transition: 0.3s ease-in-out;
				color: ${themeDark.primary};
				&:hover,
				&:active {
					border-bottom: 2px solid ${themeDark.primary};
					cursor: pointer;
				}
			}
		}
		.img {
			img {
				width: 4rem;
				height: 4rem;
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
	}

	.chat-container {
		background-color: ${themeDark.secondaryBackgound};
		padding: 1rem 2rem;
		display: flex;
		flex-direction: column;
		gap: 1rem;
		overflow-y: auto;
		max-height: 70%;
		height: 80%;
		&::-webkit-scrollbar {
			width: 0.2rem;
			&-thumb {
				background-color: #ffffff39;
				width: 0.1rem;
				border-radius: 0.2rem;
			}
		}
		.message {
			display: flex;
			align-items: center;
			.content {
				max-width: 40%;
				overflow-wrap: break-word;
				padding: 1rem;
				font-size: 1.1rem;
				border-radius: 1rem;
				background-color: red;
				color: ${themeDark.text};
			}
		}
		.sender {
			justify-content: flex-start;
			.content {
				background-color: ${themeDark.accent};
				color: ${themeDark.textSecondary};
			}
		}
		.receiver {
			justify-content: flex-end;
			.content {
				background-color: ${themeDark.primary};
			}
		}
	}

	.input-main-container {
		/* background-color: blue; */
		padding: 1rem;
		margin-top: 1rem;
		background-color: ${themeDark.secondary};
		.input-container {
			background-color: ${themeDark.background};
			width: 100%;
			border-radius: 2rem;
			display: flex;
			align-content: center;
			gap: 2rem;
			background-color: #ffffff34;
			input {
				width: 90%;
				background-color: transparent;
				color: white;
				border: none;
				padding-left: 1rem;
				font-size: 1.2rem;
				&::selection {
					background-color: ${themeDark.primary};
				}
				&:focus {
					outline: none;
				}
			}

			button {
				padding: 0.3rem 2rem;
				border-radius: 2rem;
				display: flex;
				justify-content: center;
				align-items: center;
				background-color: ${themeDark.primary};
				border: none;
				transition: 0.2s ease-in-out;
				&:hover,
				&:active {
					background-color: ${themeDark.accent};
					cursor: pointer;
					svg {
						color: ${themeDark.primary};
					}
				}
				svg {
					font-size: 2rem;
					color: ${themeDark.accent};
				}
			}
		}

		.nochat-container {
			display: flex;
			align-items: center;
			justify-content: center;
		}
	}
`;
