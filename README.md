<h1 align="center">
	<img alt="Discord logo" src="https://github.com/atthmew/interlink-mern/blob/main/frontend/screenshots/logo.png" height="150px" width="150px" />
</h1>

<h3 align="center">
  InterLink - MERN Stack & Socket.io
</h3>

<p align="center"></p>

<p align="center">
  <!-- <img alt="Project Top Language" src="https://img.shields.io/badge/98.2%25-yellow?style=for-the-badge&logo=javascript&label=JavaScript&labelColor=black"> -->
  <img alt="GitHub top language" src="https://img.shields.io/github/languages/top/atthmew/interlink-mern?style=for-the-badge">
  <img alt="GitHub language count" src="https://img.shields.io/github/languages/count/atthmew/interlink-mern?style=for-the-badge">
  <img alt="Project Top Language" src="https://img.shields.io/github/last-commit/atthmew/interlink-mern?style=for-the-badge">
  <img alt="GitHub issues" src="https://img.shields.io/github/issues/atthmew/interlink-mern?style=for-the-badge">
</p>

<p align="center">
  <a href="#-about-the-project">About The Project</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#-technologies">Technologies</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#-getting-started">Getting Started</a>&nbsp;&nbsp;&nbsp;
  <br/>
  <br/>
  <button><a href="https://linkedin-clone-ui.netlify.app/"> 
  <img alt="Project Top Language" src="https://img.shields.io/badge/Demo Application25-white?style=for-the-badge&logo=YouTube&label=YouTube&labelColor=red"/></a></button>
  <!-- <img alt="Demo" src="https://github.com/eltonlazzarin/reactjs-rocketfy-app/blob/master/screenshot/demo.png" target="_blank"></img> -->
</p>

## 📱 About this Project

<p>Introducing InterLink, a revolutionary social media platform designed to foster genuine connections without the burden of judgment. Unlike traditional networks, InterLink emphasizes user anonymity, creating a safe space free from racism, discrimination, and bias. Developed using the MERN stack and enhanced with Socket.io for real-time popups of chats, comments, likes, and notifications, InterLink ensures a seamless and secure experience. Empowering users to interact freely and authentically, InterLink is where your voice matters, not your identity. Join InterLink today and connect in a community that values your input over your identity. </p>

## 🚀 Technologies

Technologies that I used to develop the frontend and backend

- [ReactJS](https://react.dev/)
- [MongoDB](https://www.mongodb.com/)
- [ExpressJS](https://expressjs.com/)
- [NodeJS](https://nodejs.org/en)
- [Socket.IO](https://socket.io/)
- [Axios](https://axios-http.com/docs/intro)
- [React-Router-Dom](https://reactrouter.com/en/main)
- [Emoji-Picker-Heart](https://www.npmjs.com/package/emoji-picker-react)
- [ReduxJS](https://redux.js.org/)
- [Buffer](https://nodejs.org/api/buffer.html)
- [React-Icons](https://github.com/wwayne/react-tooltip)
- [Styled-Components](https://styled-components.com)
- [Toastify](https://fkhadra.github.io/react-toastify/introduction/)
- [Cors](https://expressjs.com/en/resources/middleware/cors.html)
- [BCrypt](https://www.npmjs.com/package/bcrypt)
- [Nodemon](https://nodemon.io/)
- [Mongoose](https://mongoosejs.com/docs/)
- [dotenv](https://www.npmjs.com/package/dotenv)
- [VS Code](https://code.visualstudio.com) with [Prettier RC](https://github.com/prettier/prettier)

## 👨🏼‍💻 Getting Started

### Requirements

- [Node.js](https://nodejs.org/en/)
- [Yarn](https://classic.yarnpkg.com/) or [npm](https://www.npmjs.com/)

#### Step 1: Clone the repository

```bash
git clone https://github.com/idurar/idurar-erp-crm.git
```

```bash
cd idurar-erp-crm
```

#### Step 2: Create Your MongoDB Account and Database Cluster

- Create your own MongoDB account by visiting the MongoDB website and signing up for a new account.

- Create a new database or cluster by following the instructions provided in the MongoDB documentation. Remember to note
  down the "Connect to your application URI" for the database, as you will need it later. Also, make sure to change
  `<password>` with your own password

- add your current IP address to the MongoDB database's IP whitelist to allow connections (this is needed whenever your
  ip changes)

#### Step 3: Edit the Environment File

- Check a file named .env in the /backend directory.

  This file will store environment variables for the project to run.

#### Step 4: Update MongoDB URI and PORT NUMBER

In the .env file, find the line that reads:

`MONGODB_URL = 'your-mongodb-uri'`

`PORT = 'your-port-number'`

Replace "your-mongodb-uri" with the actual URI of your MongoDB database.

Replace "your-port-number" with the actual port number in your server.js.

#### Step 5: Install Backend Dependencies

In your terminal, navigate to the /backend directory

```bash
cd backend
```

the urn the following command to install the backend dependencies:

```bash
npm install
```

This command will install all the required packages specified in the package.json file.

#### Step 6: Run Setup Script

While still in the /backend directory of the project, execute the following command to run the setup script:

```bash
npm run setup
```

This setup script may perform necessary database migrations or any other initialization tasks required for the project.

#### Step 7: Run the Backend Server

In the same terminal, run the following command to start the backend server:

```bash
npm run dev
```

This command will start the backend server, and it will listen for incoming requests.

#### Step 8: Install Frontend Dependencies

Open a new terminal window , and run the following command to install the frontend dependencies:

```bash
cd frontend
```

```bash
npm install
```

#### Step 9: Run the Frontend Server

After installing the frontend dependencies, run the following command in the same terminal to start the frontend server:

```bash
npm run dev
```

This command will start the frontend server, and you'll be able to access the website on localhost:3000 in your web
browser.

:exclamation:
:warning:` If you encounter an OpenSSL error while running the frontend server, follow these additional steps:`

Reason behind error: This is caused by the node.js V17 compatible issues with OpenSSL, see
[this](https://github.com/nodejs/node/issues/40547) and [this](https://github.com/webpack/webpack/issues/14532) issue on
GitHub.

Try one of these and error will be solved

- > upgrade to Node.js v20.

- > Enable legacy OpenSSL provider

Here is how you can enable legacy OpenSSL provider

- On Unix-like (Linux, macOS, Git bash, etc.)

```bash
export NODE_OPTIONS=--openssl-legacy-provider
```

- On Windows command prompt:

```bash
set NODE_OPTIONS=--openssl-legacy-provider
```

- On PowerShell:

```bash
$env:NODE_OPTIONS = "--openssl-legacy-provider"
```

Here is [reference](https://github.com/webpack/webpack/issues/14532#issuecomment-947012063) about enabling legacy
OpenSSL provider

After trying above solutions, run below command

```bash
npm run dev
```

> If you still facing issue, then follow
> [this stackoverflow thread](https://stackoverflow.com/questions/69692842/error-message-error0308010cdigital-envelope-routinesunsupported).
> It has so many different types of opinions. You definitely have solution after going through the thread.
