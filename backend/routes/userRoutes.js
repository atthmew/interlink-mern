const {
	register,
	login,
	setProfilePic,
	getAllUsers,
	getNotif,
	readNotif,
	getUser,
	searchUser,
} = require('../controllers/userController');

const router = require('express').Router();

// auth routes
router.post('/register', register);
router.post('/login', login);
router.post('/setProfilePic/:id', setProfilePic);
router.get('/getAllUsers/:id', getAllUsers);
router.get('/getNotif/:name', getNotif);
router.post('/readNotif', readNotif);
router.get('/getUser/:userId', getUser);
router.post('/searchUser/:search', searchUser);

module.exports = router;
