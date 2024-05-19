const {
	sendMessage,
	getAllMessage,
	getMessageNotif,
	newMessages,
	readMessage,
} = require('../controllers/messageController');

const router = require('express').Router();

router.post('/sendMessage', sendMessage);
router.post('/getAllMessage', getAllMessage);
router.post('/getMessageNotif', getMessageNotif);
router.post('/newMessages', newMessages);
router.post('/readMessage', readMessage);

module.exports = router;
