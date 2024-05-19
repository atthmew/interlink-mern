import React, { useState } from 'react';
import { IoCloseCircle } from 'react-icons/io5';

import styled from 'styled-components';
import { themeDark } from '../utils/theme';

const Likes = ({ showIt, onClose, likes }) => {
	const closeHandler = () => {
		onClose();
	};

	return (
		<Container showIt={showIt}>
			<div className="main-container">
				<div className="header">
					<div className="title"> all Likes</div>
					<IoCloseCircle onClick={closeHandler} />
				</div>
				<div className="likers-container">
					{likes.map((likerInfo) => (
						<div className="likers-info">
							<div className="img">
								<img
									src={`data:image/svg+xml;base64,${likerInfo.likerData.profilePic}`}
									alt="avatar"
									className="profile-pic"
								/>
							</div>
							<div className="liker">
								<h1>{likerInfo.likerData.fullName}</h1>
							</div>
						</div>
					))}
				</div>
			</div>
		</Container>
	);
};

export default Likes;
const Container = styled.div`
	display: ${({ showIt }) => (!showIt ? 'none' : 'flex')};
	align-items: center;
	justify-content: center;
	height: 100vh;
	width: 100vw;
	z-index: 500;
	position: fixed;
	top: 0;
	background-color: rgba(0, 0, 0, 0.582);

	.main-container {
		background-color: ${themeDark.primary};
		border-radius: 10px;
		height: 70vh;
		max-width: 90%; /* Adjust as needed */
		width: 20rem;
		position: fixed;
		top: 50%; /* Center vertically */
		left: 50%; /* Center horizontally */
		transform: translate(-50%, -50%); /* Center horizontally */
		display: flex;
		flex-direction: column; /* Adjusted for smaller screens */
		align-items: center; /* Adjusted for smaller screens */
		gap: 2rem;
		&::-webkit-scrollbar {
			width: 0.5rem;
			&-thumb {
				background-color: #ffffff39;
				width: 0.1rem;
				border-radius: 0.2rem;
			}
		}

		.header {
			height: 20%;
			width: 100%;
			display: flex;
			align-items: center;
			justify-content: center;
			position: relative;
			.title {
				font-size: 2rem;
				font-weight: bolder;
				text-transform: uppercase;
				letter-spacing: 5px;
				border-bottom: 2px solid ${themeDark.accent};
				transition: 0.2s ease-in-out;
				color: ${themeDark.accent};

				&:hover,
				&:active {
					border-bottom: 2px solid transparent;
					cursor: pointer;
				}
			}

			svg {
				position: absolute;
				font-size: 2.5rem;
				right: 1rem;
				top: 1rem;
				color: ${themeDark.accent};

				&:hover,
				&:active {
					cursor: pointer;
				}
			}
		}

		.likers-container {
			padding: 2rem;
			padding-left: 4rem;
			height: 80%;
			width: 100%;
			display: flex;
			align-items: center;
			flex-direction: column;
			gap: 1rem;
			margin-bottom: 1rem;
			.likers-info {
				display: flex;
				align-items: center;
				gap: 0.5rem;
				width: 100%;

				.img {
					.profile-pic {
						width: 3rem;
						height: 3rem;
						border-radius: 50%;
						border: 3px solid ${themeDark.accent};
					}
				}

				.liker {
					h1 {
						font-size: 1.2rem;
						color: ${themeDark.accent};
						border-bottom: 2px solid transparent;
						transition: 0.2s ease-in-out;

						&:hover,
						&:active {
							border-bottom: 2px solid ${themeDark.accent};
							cursor: pointer;
						}
					}
				}
			}
		}
	}
`;
