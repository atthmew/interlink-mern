import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

import { useNavigate, Link } from 'react-router-dom';
import { themeDark } from '../utils/theme';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

import { BiLink } from 'react-icons/bi';
import { MdOutlineConnectWithoutContact } from 'react-icons/md';

import { loginRoute } from '../utils/APIRoutes';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../store/slices/userAuthSlice';
import { toastifyOption } from '../utils/toastifyOption';

const Login = () => {
	const [errorShown, setErrorShown] = useState(false);
	const { userData, loading, error } = useSelector((state) => state.userAuth);
	const [inputValues, setInputValues] = useState({
		email: '',
		password: '',
	});

	const dispatch = useDispatch();
	const navigate = useNavigate();

	useEffect(() => {
		const checkIfLoggedIn = async () => {
			if (localStorage.getItem('interlink-userData')) {
				navigate('/');
			} else {
				navigate('/login');
			}
		};

		checkIfLoggedIn();
	}, []);

	useEffect(() => {
		if (userData.status === false) {
			if (!errorShown) {
				toast.error(userData.message, toastifyOption);
				setErrorShown(true);
			}
		} else {
			setErrorShown(false);
		}

		if (userData.status === true) {
			localStorage.setItem('interlink-userData', JSON.stringify(userData.user));
			navigate('/');
		}
	}, [userData, loading]);

	const handleChange = (e) => {
		setInputValues({ ...inputValues, [e.target.name]: e.target.value });
	};

	const validation = () => {
		const { username, password } = inputValues;

		if (username === '') {
			toast.error('Enter your username', toastifyOption);
			return false;
		} else if (password === '') {
			toast.error('Enter your password', toastifyOption);
			return false;
		}

		return true;
	};

	const submitHandler = async (e) => {
		e.preventDefault();

		if (validation()) {
			const { email, password } = inputValues;
			dispatch(loginUser({ email, password }));
		}
	};

	return (
		<>
			<Container>
				<div className="login-backgoundContainer">
					<MdOutlineConnectWithoutContact />

					<h1>
						Building Bridges <br /> in the <br /> Digital Realm
					</h1>
				</div>
				<div className="login-container">
					<div className="login-header">
						<BiLink />
						<h1>InterLink</h1>
					</div>

					<form className="login-form" onSubmit={submitHandler}>
						<input type="text" placeholder="Email" name="email" onChange={handleChange} />
						<input type="password" placeholder="Password" name="password" onChange={handleChange} />
						<button type="submit">Login</button>
					</form>

					<div className="login-confirmation">
						<span>
							Dont have an Account? <Link to="/register">Register</Link>
						</span>
					</div>
				</div>
			</Container>
			<ToastContainer />
		</>
	);
};

export default Login;
const Container = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-evenly;
	max-width: 100vw;
	min-height: 100vh;

	background-color: ${themeDark.background};
	.login-backgoundContainer {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: flex-start;
		color: ${themeDark.text};
		text-align: center;
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
			letter-spacing: 6px;
			line-height: 1.5;
			font-family: 'Averia Serif Libre', cursive;
			opacity: 0.5;
		}
	}
	.login-container {
		background-color: ${themeDark.secondaryBackgound};
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 2rem 4rem;
		border-radius: 0.5rem;
		gap: 1rem;
		.login-header {
			display: flex;
			align-items: center;
			justify-content: center;
			flex-direction: column;
			svg {
				font-size: 6rem;
				color: ${themeDark.primary};
				transition: 0.3s ease-in-out;
				&:hover,
				&:active {
					transform: translateY(-5px);
				}
			}

			h1 {
				color: ${themeDark.text};
				font-size: 2rem;
				font-weight: 800;
				padding-bottom: 2rem;
			}
		}

		.login-form {
			display: flex;
			flex-direction: column;
			gap: 2rem;
			width: 100%;
			input {
				background-color: transparent;
				padding: 1rem;
				border: 0.1rem solid ${themeDark.accent};
				font-size: 1rem;
				width: 100%;
				border-radius: 0.4rem;
				color: ${themeDark.text};
				transition: 0.5s ease-in-out;
				&:focus {
					border: 0.1rem solid ${themeDark.primary};
					outline: none;
				}
			}

			button {
				border: none;
				background-color: ${themeDark.primary};
				padding: 1rem 2rem;
				font-size: 1rem;
				text-transform: uppercase;
				font-weight: bold;
				border-radius: 0.2rem;
				color: ${themeDark.text};
				cursor: pointer;
				transition: 0.3s ease-in-out;

				&:hover,
				&:active {
					background-color: ${themeDark.accent};
					border-radius: 0.4rem;
					color: ${themeDark.textSecondary};
				}
			}
		}

		.login-confirmation {
			span {
				color: ${themeDark.text};
				text-transform: uppercase;
				a {
					color: ${themeDark.primary};
					font-weight: bold;
					text-decoration: none;
				}
			}
		}
	}

	@media (max-width: 600px) {
		.login-backgoundContainer {
			display: none;
		}
	}

	@media (min-width: 600px) {
		.login-backgoundContainer {
			display: none;
		}
	}

	@media (min-width: 992px) {
		.login-backgoundContainer {
			display: flex;
		}
	}
`;
