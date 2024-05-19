import React from 'react';
import { createBrowserRouter, createRoutesFromElements, Routes, RouterProvider, Route } from 'react-router-dom';

// layouts
import RootLayout from './layouts/RootLayout';

// pages
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import Messages from './pages/Messages';
import SetProfilePic from './pages/SetProfilePic';
import CurrentPost from './pages/CurrentPost';
import UserPage from './pages/UserPage';
import { useEffect } from 'react';

const router = createBrowserRouter(
	createRoutesFromElements(
		<>
			<Route path="/" element={<Home />} />
			<Route path="/register" element={<Register />} />
			<Route path="/login" element={<Login />} />
			<Route path="/setProfilePic" element={<SetProfilePic />} />
			<Route path="/messages" element={<Messages />} />
			<Route path="/post/:postId" element={<CurrentPost />} />
			<Route path="/user/:userId" element={<UserPage />} />
		</>
	)
);

const App = () => {
	useEffect(() => {
		const handleKeyDown = (event) => {
			// Check if the pressed key is the escape key (key code 27)
			if (event.key === 'Escape' || event.keyCode === 27) {
				// Prevent the default behavior (closing the modal)
				event.preventDefault();
			}
		};

		document.addEventListener('keydown', handleKeyDown);

		// Clean up the event listener when the component unmounts
		return () => {
			document.removeEventListener('keydown', handleKeyDown);
		};
	}, []);
	return (
		<>
			<RouterProvider router={router} />
		</>
	);
};

export default App;
