const {
	newPost,
	getAllPost,
	getComments,
	addComment,
	likePost,
	getLikes,
	getPost,
	findPosts,
} = require('../controllers/postController');

const router = require('express').Router();
const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post('/newPost', upload.single('image'), newPost);
router.get('/getAllPosts', getAllPost);
router.post('/addComment', addComment);
router.get('/getComments/:id', getComments);
router.post('/likePost', likePost);
router.get('/getLikes/:id', getLikes);
router.get('/getPost/:postId', getPost);
router.post('/findPosts', findPosts);

module.exports = router;
