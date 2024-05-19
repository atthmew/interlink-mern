import React, { useEffect, useState } from 'react';

import styled from 'styled-components';
import { themeDark } from '../utils/theme';
import { GrConnect } from 'react-icons/gr';

import { AiFillMessage } from 'react-icons/ai';
import { BsFillBellFill } from 'react-icons/bs';
import { BiLink, BiSolidSearch } from 'react-icons/bi';

import Notification from '../components/Notification';
import ProfileDropdown from '../components/ProfileDropdown';

import samplePic from '../assets/sample.jpg';
import sampleContent from '../assets/we.jpg';
import { Link, NavLink } from 'react-router-dom';
import { PiPlugsConnectedBold } from 'react-icons/pi';

import { useDispatch, useSelector } from 'react-redux';
import { readNotif } from '../store/slices/userPostsSlics';

import { io } from 'socket.io-client';
import { searchUser } from '../store/slices/userAuthSlice';

const socket = io('http://localhost:61723', {
	reconnection: true,
});

const Navbar = ({ option, notifCount, showPost, userData, notifications, messageCount }) => {
	const [showNotif, setIsShowNotif] = useState(false);
	const [showDropdownProfile, setShowDropdownProfile] = useState(false);
	const [searchInfos, setSearchInfos] = useState([]);
	const [isFocused, setIsFocused] = useState(false);
	const [isThereUser, setIsThereUser] = useState(true);
	const [searchInput, setSearchInput] = useState('');
	const [isOpen, setIsOpen] = useState(false);

	const dispatch = useDispatch();

	const toggleMenu = () => {
		setIsOpen(!isOpen);
	};

	const showNotifHandler = () => {
		const currentName = userData.fullName;
		dispatch(readNotif({ currentName, currentId: userData._id })).then((response) => {
			console.log(response.payload);
			if (response.payload.status) {
				socket.emit('notif-count', {
					notifCount: response.payload.updatedNotificationsCount,
					receiverId: response.payload.currentId,
				});
			}
		});

		setIsShowNotif(!showNotif);
	};

	const showDropdownHandler = () => {
		setShowDropdownProfile(!showDropdownProfile);
	};

	const overlayClickHandler = () => {
		setIsShowNotif(false);
		setShowDropdownProfile(false);
	};

	const focusHandler = () => {
		setIsFocused(true);
	};
	const blurHandler = () => {
		setIsFocused(false);
	};

	const searchHandler = (e) => {
		setSearchInput(e.target.value);
		setIsFocused(true);
		if (searchInput.length !== 0) {
			dispatch(searchUser({ searchInput: e.target.value })).then((response) => {
				console.log(response);
				if (response.payload.status) {
					setSearchInfos(response.payload.data);
					setIsThereUser(true);
				} else if (!response.payload.status) {
					setSearchInfos([]);
					setIsThereUser(false);
				}
			});
		}
	};

	const linkClickHandler = () => {
		setSearchInput('');
		setSearchInfos([]);
	};

	return (
		<>
			<Container showNotif={showNotif} isOpen={isOpen} showDropdown={showDropdownProfile}>
				<div className={`sidebar-open ${isOpen ? 'sideOpen' : ''} `}>
					<div className="bg-container">
						<h1>Unite and Connect</h1>
						<PiPlugsConnectedBold />
					</div>
				</div>
				<div className="navbar">
					<div className={`menu-toggle ${isOpen ? 'open' : ''}`} onClick={toggleMenu}>
						<div className="bar1"></div>
						<div className="bar2"></div>
						<div className="bar3"></div>
					</div>
					<NavLink to="/messages" activeClassName="active">
						<div className="message options" title="Messages">
							<AiFillMessage />
							{messageCount !== 0 ? <span className="counter">{messageCount}</span> : <span></span>}
						</div>
					</NavLink>

					<div className="notif options" title="Notification">
						<BsFillBellFill onClick={showNotifHandler} />
						{/* <span className="counter">{notifCount}</span> */}
						{notifCount !== 0 ? <span className="counter">{notifCount}</span> : <span></span>}
						<Notification notifications={notifications} userData={userData} show={showNotif} />
					</div>

					{option === 'home' ? (
						<div className="logo-notHome options" title="Home">
							<NavLink to="/" exact activeClassName="active">
								<BiLink />
							</NavLink>
						</div>
					) : (
						<>
							{isOpen && (
								<div className="logo-home options" title="Create Post" onClick={toggleMenu}>
									<BiLink />
								</div>
							)}
							{!isOpen && (
								<div className="logo-home options" title="Create Post" onClick={showPost}>
									<BiLink />
								</div>
							)}
						</>
					)}

					<div className="search-bar options">
						<input
							type="text"
							placeholder="Search..."
							onBlur={blurHandler}
							onFocus={focusHandler}
							onChange={searchHandler}
							name="search"
							value={searchInput}
						/>
						{searchInfos.length !== 0 && isThereUser && (
							<div className="search-container">
								{searchInfos.map((searchInfo) => (
									// <h1>{searchInfo.fullName}</h1>
									<>
										<Link onClick={linkClickHandler} to={`/user/${searchInfo._id}`}>
											<div className="infos">
												<img
													src={`data:image/svg+xml;base64,${searchInfo.profilePic}`}
													alt="profile-pic"
													className="profile-pic"
												/>
												<p>
													<span>{searchInfo.fullName} </span>
												</p>
											</div>
										</Link>
									</>
								))}
							</div>
						)}

						{!isThereUser && isFocused && (
							<div className="search-container">
								<h1>No Users Found</h1>
							</div>
						)}
					</div>

					<div className="profile-dropdown options">
						<img
							src={`data:image/svg+xml;base64,${userData.profilePic}`}
							alt="avatar"
							onClick={showDropdownHandler}
							className="profile-pic"
						/>
						<ProfileDropdown userData={userData} show={showDropdownProfile} />
					</div>
				</div>
			</Container>
			{(showNotif || showDropdownProfile) && (
				<OverlayContainer className="overlay" onClick={overlayClickHandler}></OverlayContainer>
			)}
		</>
	);
};

export default Navbar;
const OverlayContainer = styled.div`
	position: fixed;
	top: 0;
	left: 0;
	width: 100vw;
	height: 100vh;
	z-index: 4;
`;
const Container = styled.div`
	padding-bottom: 10vh;
	a {
		color: inherit;
	}

	.sidebar-open {
		position: fixed;
		transform: ${({ isOpen }) => (isOpen ? 'translate(0%)' : 'translate(100%)')};
		width: 100%;
		height: 100%;
		z-index: 8;
		background-color: ${themeDark.secondaryBackgound};
		transition: 0.3s ease-in;

		.bg-container {
			width: 100%;
			display: flex;
			align-items: center;
			justify-content: center;
			flex-direction: column;
			padding-top: 20vh;
			gap: 2rem;
			svg {
				font-size: 15rem;
				color: ${themeDark.primary};
				opacity: 0.5;
				transition: 0.3s ease-in-out;
				&:hover,
				&:active {
					transform: translateY(-10px);
				}
			}
			h1 {
				font-size: 3rem;
				text-align: center;
				letter-spacing: 6px;
				line-height: 1.5;
				padding-top: 2rem;
				font-family: 'Averia Serif Libre', cursive;
				opacity: 0.3;
				color: ${themeDark.text};
				transition: 0.3s ease-in-out;
			}
		}
	}

	.navbar {
		background-color: ${themeDark.secondaryBackgound};
		position: fixed;
		width: 100%;
		display: grid;
		grid-template-columns: 20% 20% 20% 20% 20%;
		align-items: center;
		justify-items: center;
		padding: 0 1rem;
		color: ${themeDark.primary};
		min-height: 10vh;
		z-index: 5;
		.menu-toggle {
			display: none;
			z-index: 3;
		}
		.active {
			.message {
				svg {
					color: ${themeDark.accent};
				}
			}
			.logo {
				background-color: ${themeDark.primary};

				svg {
					background-color: red;
				}
			}
		}

		a.active {
		}

		.options {
			svg {
				font-size: 2rem;
				&:hover,
				&:active {
					cursor: pointer;
				}
			}
			.profile-pic {
				width: 3rem;
				height: 3rem;
				border-radius: 50%;
				border: 3px solid ${({ showDropdown }) => (showDropdown ? themeDark.accent : themeDark.primary)};

				transition: 0.3s ease-in-out;
				&:hover,
				&:active {
					border: 3px solid ${themeDark.accent};
					cursor: pointer;
				}
			}
			input {
				background: none;
				border: none;
				border-bottom: 2px solid ${themeDark.primary};
				color: ${themeDark.text};
				padding: 0.2rem;
				font-size: 1rem;
				transition: 0.3s ease-in-out;
				&:focus {
					outline: none;
					border-bottom: 2px solid ${themeDark.accent};
				}

				&:hover,
				&:active {
					border-bottom: 2px solid ${themeDark.accent};
				}
			}
		}

		.message,
		.notif {
			position: relative;
			.counter {
				position: absolute;
				/* display: flex; */
				/* justify-content: center; */
				/* align-items: center; */
				color: ${themeDark.text};
				background-color: red;
				padding: 0.2rem 0.6rem;
				font-size: 1rem;
				border-radius: 50%;
				top: -5px;
				right: -15px;
			}
			svg {
				transition: 0.3s ease-in-out;
				&:hover,
				&:active {
					color: ${themeDark.accent};
				}
			}
		}

		.notif {
			svg {
				color: ${({ showNotif }) => (showNotif ? themeDark.accent : themeDark.primary)};
			}
		}

		.profile-dropdown {
			position: relative;
		}

		.search-bar {
			position: relative;
			.search-container {
				position: absolute;
				top: 50%;
				left: 50%;
				transform: translate(-50%, 5%);
				color: black;
				width: 100%;
				min-width: 25rem;
				min-height: 30rem;
				height: 100%;
				background-color: ${themeDark.primary};
				padding: 0.5rem;
				border-radius: 0.4rem;
				border: 3px solid ${themeDark.accent};
				z-index: 100;

				overflow: auto;
				&::-webkit-scrollbar {
					width: 0.5rem;
					&-thumb {
						border-radius: 0.4rem;
						background-color: ${themeDark.accent};
					}
				}
				a {
					text-decoration: none;
				}

				.infos {
					display: flex;
					align-items: center;
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
				}
				h1 {
					color: ${themeDark.accent};
					text-align: center;
					padding-top: 12rem;
				}
			}
		}

		.logo-notHome {
			background-color: ${themeDark.primary};
			color: ${themeDark.accent};
			display: flex;
			align-items: center;
			justify-content: center;
			border-radius: 50%;
			padding: 0.5rem;
			transition: 0.3s ease-in-out;
			&:hover,
			&:active {
				background-color: ${themeDark.accent};
				color: ${themeDark.primary};
			}
		}

		.logo-home {
			background-color: ${themeDark.accent};
			color: ${themeDark.primary};
			display: flex;
			align-items: center;
			justify-content: center;
			border-radius: 50%;
			padding: 0.5rem;
			transition: 0.3s ease-in-out;
			&:hover,
			&:active {
				background-color: ${themeDark.primary};
				color: ${themeDark.accent};
			}
		}
	}

	@media (max-width: 600px) {
		.navbar {
			grid-template-columns: 1fr 1fr 1fr;
			z-index: 9;
			align-content: center;
			.message,
			.profile-dropdown,
			.notif {
				display: ${({ isOpen }) => (isOpen ? 'grid' : 'none')};
			}

			.message {
				grid-column: -3;
				grid-row: 1;
			}

			.notif {
				grid-column: -4;
				grid-row: 2;
			}

			.logo-home,
			.logo-notHome,
			.search-bar,
			.menu-toggle {
				margin-top: ${({ isOpen }) => (isOpen ? '.8rem' : '0')};
				margin-bottom: ${({ isOpen }) => (isOpen ? '.8rem' : '0')};
			}
			.logo-home,
			.logo-notHome {
				padding: 0.4rem;
				margin-right: auto;
				order: -1;
			}

			.search-bar {
				grid-row: 1;
				grid-column: 2;
			}

			.sidebar-open {
				position: relative;
			}

			.menu-toggle {
				display: flex;
				flex-direction: column;
				cursor: pointer;
				z-index: 20;
				transition: 0.3s ease-in-out;
				grid-row: 1;
				grid-column: 3;
				margin-left: auto;
				order: 10;
				&:hover,
				&:active {
					.bar1,
					.bar2,
					.bar3 {
						background-color: ${themeDark.accent};
					}
				}
				/* justify-self: flex-start; */
			}

			.bar1,
			.bar2,
			.bar3 {
				width: 25px;
				height: 3px;
				background-color: ${themeDark.primary};
				margin: 3px 0;
				transition: 0.4s;
			}

			.open .bar1 {
				transform: rotate(-48deg) translate(-9px, 4px);
			}

			.open .bar2 {
				opacity: 0;
			}

			.open .bar3 {
				transform: rotate(48deg) translate(-7px, -5px);
			}

			.nav-links {
				display: none;
			}

			.open .nav-links {
				display: flex;
				flex-direction: column;
				list-style: none;
				padding: 0;
			}
		}
	}

	@media (max-width: 650px) {
		.notif {
			left: 2rem;
		}
	}
`;
