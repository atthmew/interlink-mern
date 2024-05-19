import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

import { useNavigate, Link } from 'react-router-dom';
import { themeDark } from '../utils/theme';
import { BiLink, BiSolidGroup } from 'react-icons/bi';
import { AiOutlineWechat } from 'react-icons/ai';

import { useDispatch, useSelector } from 'react-redux';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { registerUser } from '../store/slices/userAuthSlice';
import { toastifyOption } from '../utils/toastifyOption';

const Register = () => {
	const [isLoading, setIsLoading] = useState(false);
	const [errorShown, setErrorShown] = useState(false);
	const { userData, loading, error } = useSelector((state) => state.userAuth);
	const [inputValues, setInputValues] = useState({
		username: '',
		fullName: '',
		address: '',
		password: '',
		confirmPassword: '',
	});
	const navigate = useNavigate();
	const dispatch = useDispatch();

	useEffect(() => {
		const checkIfLoggedIn = async () => {
			if (localStorage.getItem('interlink-userData')) {
				navigate('/');
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
		const { email, fullName, password, confirmPassword } = inputValues;

		if (fullName.length < 6) {
			toast.error('Full Name is required', toastifyOption);
			return false;
		} else if (email === '') {
			toast.error('Email is required.', toastifyOption);
			return false;
		} else if (password.length < 8) {
			toast.error('Password must be 8 characters above.', toastifyOption);
			return false;
		} else if (password !== confirmPassword) {
			toast.error('Password and Confirm Password does not match.', toastifyOption);
			return false;
		}

		return true;
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (validation()) {
			const { email, fullName, password } = inputValues;
			dispatch(registerUser({ email, fullName, password }));
		}
	};

	return (
		<>
			<Container>
				<AiOutlineWechat className="background-logo" />
				<BiSolidGroup className="background-logo-second" />
				<div className="register-container">
					<div className="register-header">
						<BiLink />
						<h1>InterLink</h1>
					</div>

					<form className="register-form" onSubmit={handleSubmit}>
						<input type="text" placeholder="Full Name" name="fullName" onChange={handleChange} />
						<input type="email" placeholder="Email" name="email" onChange={handleChange} />
						<input type="password" placeholder="Password" name="password" onChange={handleChange} />
						<input type="password" placeholder="Confirm Password" name="confirmPassword" onChange={handleChange} />
						<button type="submit">Create Account</button>
					</form>

					<div className="register-confirmation">
						<span>
							Already have an Account? <Link to="/login">Login</Link>
						</span>
					</div>
				</div>
			</Container>
			<ToastContainer />
		</>
	);
};

export default Register;
const Container = styled.div`
	position: relative;
	display: flex;
	align-items: center;
	justify-content: center;
	flex-direction: column;
	background-color: ${themeDark.background};
	padding: 6rem 0;
	.background-logo {
		position: absolute;
		font-size: 25rem;
		opacity: 0.1;
		bottom: 0;
		right: 4rem;
		color: ${themeDark.primary};
	}
	.background-logo-second {
		position: absolute;
		font-size: 25rem;
		opacity: 0.1;
		top: 0;
		left: 4rem;
		color: ${themeDark.primary};
	}
	.register-container {
		background-color: ${themeDark.secondaryBackgound};
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 2rem 4rem;
		border-radius: 0.5rem;
		gap: 0.5rem;
		.register-header {
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

		.register-form {
			display: flex;
			flex-direction: column;
			gap: 1.5rem;
			width: 100%;
			z-index: 100;
			input {
				background-color: transparent;
				padding: 1rem;
				border: 0.1rem solid ${themeDark.primary};
				font-size: 1rem;
				width: 100%;
				border-radius: 0.4rem;
				color: ${themeDark.text};
				transition: 0.5s ease-in-out;
				&:focus {
					border: 0.1rem solid ${themeDark.accent};
					outline: none;
				}
			}

			button {
				border: none;
				background-color: ${themeDark.accent};
				padding: 1rem 2rem;
				font-size: 1rem;
				text-transform: uppercase;
				font-weight: bold;
				border-radius: 0.2rem;
				color: ${themeDark.textSecondarys};
				cursor: pointer;
				transition: 0.3s ease-in-out;

				&:hover,
				&:active {
					background-color: ${themeDark.primary};
					border-radius: 0.4rem;
					color: ${themeDark.text};
				}
			}
		}

		.register-confirmation {
			z-index: 100;
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
		.background-logo {
			display: none;
		}
		.background-logo-second {
			display: none;
		}
	}

	@media (min-width: 600px) {
		.background-logo {
			display: none;
		}
		.background-logo-second {
			display: none;
		}
	}

	@media (min-width: 992px) {
		.background-logo {
			display: inline;
		}
		.background-logo-second {
			display: inline;
		}
	}
`;
