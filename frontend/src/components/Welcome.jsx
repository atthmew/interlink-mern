import React from 'react';

import styled from 'styled-components';
import Robot from '../assets/robot.gif';
import { themeDark } from '../utils/theme';

const Welcome = ({ currentUser }) => {
	return (
		<Container>
			<img src={Robot} alt="Robot" />
			<h1>
				Welcome <span>{currentUser.fullName}!</span>
			</h1>
			<h3>Please select a chat to Start Messaging.</h3>
		</Container>
	);
};

export default Welcome;
const Container = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	color: ${themeDark.text};
	text-align: center;
	img {
		height: 20rem;
	}

	span {
		color: ${themeDark.primary};
	}
`;
