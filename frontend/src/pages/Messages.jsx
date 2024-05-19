import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import Navbar from '../components/Navbar';

import { themeDark } from '../utils/theme';

import { io } from 'socket.io-client';

import axios from 'axios';
import { ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getAllUsers, setUserData } from '../store/slices/userAuthSlice';
import Chat from '../components/Chat';
import { getNotif } from '../store/slices/userPostsSlics';
import { getMessageNotif, newMessages, readMessage } from '../store/slices/messageSlice';

const Messages = () => {
	const [isLoading, setIsLoading] = useState(true);
	const [showNewPost, setShowNewPost] = useState(false);
	const [contacts, setContacts] = useState([]);
	const [currentChat, setCurrentChat] = useState(null);
	const [messages, setMessages] = useState([]);
	const [currentSelected, setCurrentSelected] = useState(undefined);
	const [notifications, setNotifications] = useState([]);
	const [notifCount, setNotifCount] = useState(0);
	const [messageCount, setMessageCount] = useState(0);
	const [arrayNewMessages, setArrayNewMessages] = useState([]);
	const [updatedMessages, setUpdatedMessages] = useState([]);

	const rawData = localStorage.getItem('interlink-userData');
	const userData = JSON.parse(rawData);

	const socket = useRef();

	const navigate = useNavigate();
	const dispatch = useDispatch();

	useEffect(() => {
		const checkIfLoggedIn = async () => {
			const storedUserData = localStorage.getItem('interlink-userData');
			if (!storedUserData) {
				navigate('/login');
			} else {
				dispatch(setUserData(JSON.parse(storedUserData)));
				setIsLoading(false);
			}
		};

		checkIfLoggedIn();
	}, []);

	useEffect(() => {
		dispatch(getNotif({ currentUser: userData.fullName })).then((response) => {
			if (response.payload.data) {
				setNotifications(response.payload.data);
			}
		});
	}, []);

	useEffect(() => {
		if (userData) {
			socket.current = io('http://localhost:61723');
			socket.current.emit('add-user', userData._id);
		}
	}, []);

	useEffect(() => {
		if (userData._id) {
			dispatch(getAllUsers({ currentUserId: userData._id })).then((response) => {
				if (response.payload.data) {
					const allContacts = response.payload.data;
					setContacts(allContacts);
				}
			});
		}
	}, [dispatch, userData]);

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
			socket.current.emit('add-user', userData._id);
		}

		socket.current.on('new-count', (newCount) => {
			setNotifCount(newCount);
		});
		socket.current.on('new-notif', (newNotif) => {
			setNotifications(newNotif);
		});

		socket.current.on('new-msgCount', (newMsg) => {
			setMessageCount(newMsg);
		});

		socket.current.on('new-notifMsg', (newNotifMsg) => {
			console.log(newNotifMsg);
			setArrayNewMessages(newNotifMsg);
		});
	}, []);

	useEffect(() => {
		if (userData) {
			dispatch(getMessageNotif({ currentUserId: userData._id })).then((response) => {
				if (response.payload.status) {
					setMessageCount(response.payload.count);
				}
			});
		}
	}, []);

	const selectContactHandler = (index, contact) => {
		setCurrentChat(contact);
		setCurrentSelected(index);
	};

	useEffect(() => {
		if (userData) {
			dispatch(newMessages({ currentUserId: userData._id })).then((response) => {
				if (response.payload.status) {
					setArrayNewMessages(response.payload.newMessages);
				}
			});
		}
	}, []);

	useEffect(() => {
		setUpdatedMessages(arrayNewMessages);
	}, [arrayNewMessages]);

	const showNewPostHandler = () => {
		setShowNewPost(!showNewPost);
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
				<div className="container">
					<div className="chat-users">
						<div className="title">
							<h1>LiNKS</h1>
						</div>

						<div className="chats">
							{contacts &&
								contacts.map((contact, index) => {
									const hasUnreadMessage = updatedMessages.some(
										(message) =>
											message.users.includes(contact._id) && message.users[1] === userData._id && !message.isRead
									);

									return (
										<div
											className={`user-container ${index === currentSelected ? 'selected' : ''}`}
											key={index}
											onClick={() => selectContactHandler(index, contact)}
										>
											<div className="user-img">
												<img
													src={`data:image/svg+xml;base64,${contact.profilePic}`}
													alt="avatar"
													className="profile-pic"
												/>
												{hasUnreadMessage ? <span className="hasMessage">!</span> : null}
											</div>
											<div className="user-name">
												<h1>{contact.fullName}</h1>
											</div>
										</div>
									);
								})}
						</div>
					</div>
					<div className="chat-body">
						<Chat userData={userData} messages={messages} currentChat={currentChat} socket={socket} />
					</div>
				</div>
			</Container>
			<ToastContainer />
		</>
	);
};

export default Messages;
const Container = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	/* padding-bottom: 2rem; */
	margin: 1rem 2rem;
	z-index: 5;
	.container {
		background-color: ${themeDark.secondaryBackgound};
		width: 100%;
		height: 90vh;
		display: flex;
		overflow: hidden;
		border-radius: 0.5rem;

		.chat-users {
			width: 30%;
			.title {
				display: flex;
				align-items: center;
				justify-content: center;
				padding: 2rem;
				padding-top: 3rem;
				background-color: ${themeDark.primary};
				height: 15%;
				font-size: 1.1rem;

				h1 {
					letter-spacing: 5px;
				}
			}
			.chats {
				padding: 1rem;
				height: 90%;
				max-height: 80vh;
				overflow-y: auto;
				&::-webkit-scrollbar {
					width: 0.2rem;
					&-thumb {
						background-color: #ffffff39;
						width: 0.1rem;
						border-radius: 0.2rem;
					}
				}
				.user-container {
					background-color: ${themeDark.secondary};
					display: flex;
					align-items: center;
					gap: 2vw;
					padding: 1vw 2vw;
					margin-top: 1rem;
					border-radius: 0.5rem;
					border: 2px solid transparent;
					transition: 0.3s ease-in-out;
					&:hover,
					&:active {
						border: 2px solid ${themeDark.primary};
						cursor: pointer;
					}
					.user-img {
						position: relative;
						img {
							width: 3rem;
							height: 3rem;
							border-radius: 50%;
						}

						.hasMessage {
							position: absolute;
							color: white;
							font-size: 1rem;
							top: -0.5rem;
							right: 0;
							background: red;
							padding: 0.2rem 0.4rem;
							border-radius: 50%;
						}
					}
					.user-name {
						h1 {
							font-size: 1.5rem;
							letter-spacing: 1px;
							color: ${themeDark.primary};
							font-weight: bolder;
						}
					}
				}

				.selected {
					background-color: ${themeDark.primary};
					.user-name {
						h1 {
							color: ${themeDark.text};
						}
					}
					/* border: 2px solid ${themeDark.primary}; */
				}

				.active {
					border: 2px solid ${themeDark.primary};
				}
			}
		}

		.chat-body {
			width: 70%;
			/* background-color: blue; */
		}
	}

	@media (max-width: 600px) {
		.user-name {
			display: none;
		}

		.user-container {
			justify-content: center;
		}

		.title {
			h1 {
				/* font-size: 2.2rem; */
				letter-spacing: 0;
			}
		}
	}

	@media (min-width: 601px) and (max-width: 900px) {
		.user-name {
			h1 {
				font-size: 1rem !important;
				color: blue;
			}
		}

		.user-container {
			padding: 0.5vw 1vw !important;
		}
	}
`;
