import React, { useEffect, useState } from 'react';

import styled from 'styled-components';
import { BiImageAdd } from 'react-icons/bi';
import { themeDark } from '../utils/theme';

import samplePic from '../assets/sample.jpg';

import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setUserData } from '../store/slices/userAuthSlice';
import { getAllPosts, newPost } from '../store/slices/userPostsSlics';

import { ToastContainer, toast } from 'react-toastify';

const NewPost = ({ showPost, userData }) => {
	const [image, setImage] = useState('');
	const [caption, setCaption] = useState('');
	const [isImageSet, setIsImageSet] = useState(false);
	const [userName, setUserName] = useState('');
	const [profilePic, setProfilePic] = useState('');
	const [createdAt, setCreatedAt] = useState('');
	const [allPosts, setPosts] = useState([]);
	const dispatch = useDispatch();
	const posts = useSelector((state) => state.userPosts.posts);
	const navigate = useNavigate();

	const toastifyOption = {
		theme: 'dark',
		pauseOnHover: true,
		position: 'bottom-right',
		draggable: true,
	};

	useEffect(() => {
		const checkIfLoggedIn = async () => {
			const storedUserData = localStorage.getItem('interlink-userData');
			if (!storedUserData) {
				navigate('/login');
			} else {
				dispatch(setUserData(JSON.parse(storedUserData)));
			}
		};

		checkIfLoggedIn();
	}, []);

	useEffect(() => {
		setUserName(userData.fullName);
		setProfilePic(userData.profilePic);
		setCreatedAt(userData.createdAt);
		if (image !== '') {
			setIsImageSet(true);
		}
	}, [image, userData]);

	const handleImageChange = (e) => {
		setImage(e.target.files[0]);
	};

	const handleCaptionChange = (e) => {
		setCaption(e.target.value);
	};

	useEffect(() => {
		dispatch(getAllPosts());
	}, [dispatch]);

	useEffect(() => {
		setPosts(posts);
	}, [posts]);

	const postValidation = () => {
		if (caption === '') {
			toast.dismiss();
			toast.error('Caption is required', toastifyOption);
			return false;
		}
		return true;
	};

	const submitPost = () => {
		console.log(`CAPTION: ${caption}`);
		// console.log(userName, image);
		// console.log(`PROFILE:${userData.profilePic}`);
		// console.log(`created:${userData.createdAt}`);
		// if (userData.createdAt) {
		console.log(`CREATED AT: ${userData.dateCreated}`);
		// } else {
		// 	console.log('CREATED AT is undefined or not available.');
		// }

		// console.log(new Date());

		if (postValidation()) {
			dispatch(newPost({ caption, fullName: userName, image, profilePic, authorId: userData._id })).then((response) => {
				window.location.reload();
			});
		}
	};

	return (
		<>
			<Container showPost={showPost}>
				<div className="new-post-container">
					<div className="new-post-content">
						<div className="user-info">
							<img src={`data:image/svg+xml;base64,${profilePic}`} alt="profile-pic" />
							<h3>{userData.fullName}</h3>
						</div>

						<div className="contents">
							<input type="text" placeholder="Enter Caption.." onChange={handleCaptionChange} />

							<div className="upload-container">
								<input type="file" id="profile-pic" onChange={handleImageChange} />
								{isImageSet ? (
									<label htmlFor="profile-pic">
										<span> {image.name}</span>
									</label>
								) : (
									<label htmlFor="profile-pic">
										<span>Add Photo </span>
										<BiImageAdd />
									</label>
								)}
							</div>
						</div>

						<button className="post" onClick={submitPost}>
							POST
						</button>
					</div>
					{/* <img src={testImg} alt="post" /> */}
				</div>
			</Container>
			<ToastContainer />
		</>
	);
};

export default NewPost;
const Container = styled.div`
	.new-post-container {
		display: ${({ showPost }) => (showPost ? 'flex' : 'none')};
		align-items: center;
		justify-content: center;
		flex-direction: column;
		color: ${themeDark.text};

		.new-post-content {
			background-color: ${themeDark.secondaryBackgound};
			margin-top: 2rem;
			padding: 1rem 3rem;
			display: flex;
			flex-direction: column;
			z-index: 2;
			gap: 1rem;
			width: 40%;
			.user-info {
				display: flex;
				align-items: center;
				gap: 1rem;
				img {
					width: 3.5rem;
					height: 3.5rem;
					border-radius: 50%;
				}
			}

			.contents {
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;
				gap: 1rem;

				input[type='text'] {
					background-color: transparent;
					text-align: center;
					width: 100%;

					font-size: 1.5rem;
					border: none;
					border-bottom: 2px solid ${themeDark.primary};
					color: ${themeDark.text};

					width: 100%;
					text-align: center;
					&:focus {
						outline: none;
						border-bottom: 2px solid ${themeDark.accent};
					}
				}

				.upload-container {
					width: 100%;
					input[type='file'] {
						display: none;
					}
					label {
						display: flex;
						align-items: center;
						justify-content: center;
						flex-direction: column;
						width: 100%;
						height: 10rem;
						border-radius: 0.5rem;
						border: 2px solid ${themeDark.primary};
						transition: 0.3s ease-in-out;
						svg {
							opacity: 0.5;
							font-size: 4rem;
						}

						span {
							font-size: 2rem;
							opacity: 0.5;
							text-align: center;
						}

						&:hover,
						&:active {
							cursor: pointer;
							border: 2px solid ${themeDark.accent};
						}
					}
				}
			}

			.post {
				align-self: center;
				font-size: 1.5rem;
				padding: 0.5rem 1rem;
				width: 70%;
				border-radius: 0.4rem;
				background-color: ${themeDark.primary};
				border: none;
				transition: 0.3s ease-in-out;
				&:focus {
					outline: none;
				}

				&:hover,
				&:active {
					background-color: ${themeDark.accent};
					cursor: pointer;
				}
			}
		}
	}

	@media (max-width: 768px) {
		.new-post-container {
			.new-post-content {
				width: 90%;
			}
		}
	}
	@media (min-width: 1200px) {
	}
`;
