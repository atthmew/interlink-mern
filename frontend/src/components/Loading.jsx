import React from 'react';
import styled from 'styled-components';
import { BiLink } from 'react-icons/bi';
import { themeDark } from '../utils/theme';

const Loading = () => {
	return (
		<LoadingContainer>
			<div className="loading">
				<BiLink />
			</div>
		</LoadingContainer>
	);
};

export default Loading;
const LoadingContainer = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	background-color: ${themeDark.background};
	color: ${themeDark.text};
	height: 100vh;
	width: 100vw;
	.loading {
		font-size: 10rem;
		color: ${themeDark.primary};
	}
`;
