import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import loader from '../assets/loader.gif';

import { useNavigate } from 'react-router-dom';
import { setAvatarRoute } from '../utils/APIRoutes';

import { Buffer } from 'buffer';
import { useDispatch, useSelector } from 'react-redux';
import { setProfilePic } from '../store/slices/userAuthSlice';
import { themeDark } from '../utils/theme';

function SetProfilePic(props) {
	const avatarApi = 'https://api.multiavatar.com';
	const MULTIAVATAR_API_KEY = 'aDhdkZ2yLpBNtK';
	const navigate = useNavigate();
	const [avatars, setAvatars] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [selectedAvatar, setSelectedAvatar] = useState(undefined);

	const dispatch = useDispatch();

	const { userData } = useSelector((state) => state.userAuth);

	const toastifyOption = {
		theme: 'dark',
		pauseOnHover: true,
		position: 'bottom-right',
		draggable: true,
	};

	useEffect(() => {
		const checkIfLoggedIn = async () => {
			if (!localStorage.getItem('interlink-userData')) {
				navigate('/login');
			}
		};

		checkIfLoggedIn();
	}, []);

	useEffect(() => {
		const getAvatar = async () => {
			const data = [];

			for (let i = 0; i < 4; i++) {
				const image = await axios.get(`${avatarApi}/${Math.round(Math.random() * 1000)}?apikey=${MULTIAVATAR_API_KEY}
					`);
				const buffer = new Buffer(image.data);

				data.push(buffer.toString('base64'));
			}

			setAvatars(data);
			setIsLoading(false);
		};

		getAvatar();
	}, []);

	useEffect(() => {
		const checkProfileIsSet = async () => {
			console.log(userData);
			const user = await JSON.parse(localStorage.getItem('interlink-userData'));
			if (userData.isSet) {
				user.isProfilePicSet = true;
				user.profilePic = avatars[selectedAvatar];
				localStorage.setItem('interlink-userData', JSON.stringify(user));
				navigate('/');
			}
		};
		checkProfileIsSet();
	}, [userData]);

	const setProfilePicture = async () => {
		if (selectedAvatar === undefined) {
			toast.error('Please select avatar', toastifyOption);
		} else {
			const user = await JSON.parse(localStorage.getItem('interlink-userData'));
			dispatch(setProfilePic({ id: user._id, profilePic: avatars[selectedAvatar] }));
		}
	};

	return (
		<>
			{isLoading ? (
				<Container>
					<img src={loader} alt="Loading" className="loader" />
				</Container>
			) : (
				<Container>
					<div className="title-container">
						<h1>Pick an avatar as your Profile Picture</h1>
					</div>

					<div className="avatars">
						{avatars.map((avatar, index) => {
							return (
								<div key={index} className={`avatar ${selectedAvatar === index ? 'selected' : ''}`}>
									<img
										src={`data:image/svg+xml;base64,${avatar}`}
										alt="avatar"
										key={avatar}
										onClick={() => setSelectedAvatar(index)}
									/>
								</div>
							);
						})}
					</div>
					<button className="submit-btn" onClick={setProfilePicture}>
						Set as Profile Picture
					</button>
				</Container>
			)}
			<ToastContainer></ToastContainer>
		</>
	);
}

export default SetProfilePic;
const Container = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	gap: 3rem;
	background-color: ${themeDark.background};
	max-width: 100vw;
	min-height: 100vh;
	padding: 3rem;
	.loader {
		max-inline-size: 100%;
	}

	.title-container {
		h1 {
			color: white;
		}
	}

	.avatars {
		display: flex;
		gap: 2rem;
		.avatar {
			border: 0.4rem solid transparent;
			padding: 0.4rem;
			border-radius: 5rem;
			display: flex;
			justify-content: center;
			align-items: center;
			transition: 0.5s ease-in-out;
			img {
				height: 6rem;
			}
		}

		.selected {
			border: 0.4rem solid ${themeDark.primary};
		}
	}

	.submit-btn {
		background-color: ${themeDark.primary};
		color: white;
		padding: 1rem 2rem;
		border: none;
		font-weight: bold;
		cursor: pointer;
		border-radius: 0.4rem;
		font-size: 1rem;
		transition: 0.5s ease-in-out;
		text-transform: uppercase;
		&:hover,
		&:active {
			color: ${themeDark.textSecondary};
			background-color: ${themeDark.accent};
		}
	}

	@media (max-width: 600px) {
		html {
			font-size: 80%;
		}
		.avatars {
			flex-direction: column;
		}
		.title-container {
			h1 {
				text-align: center;
			}
		}

		.submit-btn {
			line-height: 1.5;
		}
	}
`;
