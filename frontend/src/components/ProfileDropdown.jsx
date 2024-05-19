import React, { useState } from 'react';

import styled from 'styled-components';
import { themeDark } from '../utils/theme';

import { BsPersonCircle } from 'react-icons/bs';
import { IoSettingsSharp } from 'react-icons/io5';
import { BiLogOutCircle } from 'react-icons/bi';
import { useNavigate } from 'react-router-dom';

const ProfileDropdown = ({ show, userData }) => {
	const navigate = useNavigate();
	const logoutHandler = () => {
		localStorage.clear();
		navigate('/login');
	};

	return (
		<Container show={show}>
			<div className="header-info">
				<h1>{userData.fullName}</h1>
			</div>
			<div className="dropdown-container">
				<div className="profile-details drop-prof">
					<BsPersonCircle />
					<h1>Profile</h1>
				</div>

				<div className="settings drop-prof">
					<IoSettingsSharp />
					<h1>Settings</h1>
				</div>

				<div className="logout drop-prof" onClick={logoutHandler}>
					<BiLogOutCircle />
					<h1>Logout</h1>
				</div>
			</div>
		</Container>
	);
};

export default ProfileDropdown;
const Container = styled.div`
	display: ${({ show }) => (show ? 'flex' : 'none')};
	flex-direction: column;
	gap: 1.5rem;
	align-items: center;
	position: absolute;
	width: 18rem;
	height: 20rem;
	background-color: ${themeDark.primary};
	top: 50%;
	left: 50%;
	transform: translate(-50%, 10%);
	/* padding: 0.5rem; */
	border-radius: 0.4rem;
	overflow: auto;
	color: ${themeDark.text};
	&::-webkit-scrollbar {
		width: 0.5rem;
		&-thumb {
			border-radius: 0.4rem;
			background-color: ${themeDark.accent};
		}
	}
	.header-info {
		display: block;
		justify-content: center;
		width: 100%;
		h1 {
			padding: 0.5rem 1rem;
			text-align: center;
			color: ${themeDark.textSecondary};
			background-color: ${themeDark.accent};
			font-size: 1.5rem;
		}
	}

	.dropdown-container {
		display: flex;
		flex-direction: column;
		gap: 2rem;

		.drop-prof {
			display: flex;
			align-items: center;
			gap: 1.5rem;
			padding: 0.5rem 1rem;
			transition: 0.3s ease-in-out;
			border-radius: 0.4rem;
			&:hover,
			&:active {
				background-color: #b7c8c146;
				cursor: pointer;
			}

			h1 {
				font-size: 1.5rem;
				text-transform: uppercase;
				font-weight: 600;
				letter-spacing: 1.5px;
			}
		}

		.logout {
			&:hover,
			&:active {
				background-color: #da1a1a5c;
			}
		}
	}

	@media (max-width: 600px) {
		top: 50%;
		left: 20%;
		transform: translate(-80%, 10%);
	}

	@media (max-width: 1350px) {
		left: -3rem;
	}
`;
