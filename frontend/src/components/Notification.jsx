import React from 'react';
import styled from 'styled-components';

import { themeDark } from '../utils/theme';
import { Link } from 'react-router-dom';

const Notification = ({ show, notifications }) => {
	return (
		<Container show={show}>
			<ul>
				{notifications && notifications.length > 0 ? (
					notifications
						.map((notif, index) => (
							<Link to={`/post/${notif.postId}`}>
								<li key={index}>
									{' '}
									{/* Ensure keys are unique for better performance */}
									<img
										src={`data:image/svg+xml;base64,${notif.notifierData.profilePic}`}
										alt="avatar"
										className="profile-pic"
									/>
									<p>
										<span>{notif.notifierData.fullName} </span>
										{notif.notification === 'Like' ? 'liked your post' : 'commented on your post'}
									</p>
								</li>
							</Link>
						))
						.reverse()
				) : (
					<h1>No Notifications Found</h1> // This will render if notifications are undefined or empty
				)}
			</ul>
		</Container>
	);
};

export default Notification;

const Container = styled.div`
	display: ${({ show }) => (show ? 'block' : 'none')};
	position: absolute;
	width: 25rem;
	height: 30rem;
	background-color: ${themeDark.primary};
	top: 50%;
	left: 50%;
	transform: translate(-50%, 5%);
	padding: 0.5rem;
	border-radius: 0.4rem;
	border: 3px solid ${themeDark.accent};

	overflow: auto;
	&::-webkit-scrollbar {
		width: 0.5rem;
		&-thumb {
			border-radius: 0.4rem;
			background-color: ${themeDark.accent};
		}
	}

	ul {
		display: flex;
		flex-direction: column;
		justify-content: center;

		a {
			text-decoration: none;
		}

		li {
			list-style: none;
			display: flex;
			align-items: center;
			margin: 0.5rem 0;
			padding: 0.5rem 1rem;
			gap: 1rem;
			color: ${themeDark.text};
			transition: 0.3s ease-in-out;
			&:hover,
			&:active {
				background-color: #b7c8c146;
			}

			img {
				width: 5rem;
				height: 4rem;
				border-radius: 50%;
			}
			p {
				font-size: 1rem;
				width: 90%;
				color: ${themeDark.accent};
				span {
					font-weight: bold;
					color: ${themeDark.text};
				}
			}

			&:hover,
			&:active {
				cursor: pointer;
			}
		}

		h1 {
			color: ${themeDark.accent};
			text-align: center;
			padding-top: 12rem;
		}
	}

	@media (max-width: 600px) {
		top: 50%;
		left: 0%;
		transform: translate(-10vw, 8vw);
	}
`;
