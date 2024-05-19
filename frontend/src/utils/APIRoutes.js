export const host = 'http://localhost:61723';

// user
export const registerRoute = `${host}/api/auth/register`;
export const loginRoute = `${host}/api/auth/login`;
export const setProfileRoute = `${host}/api/auth/setProfilePic`;
export const getAllUsersRoute = `${host}/api/auth/getAllUsers`;
export const getUserRoute = `${host}/api/auth/getUser`;
export const searchUserRoute = `${host}/api/auth/searchUser`;

// posts
export const newPostRoute = `${host}/api/post/newPost`;
export const getAllPostsRoute = `${host}/api/post/getAllPosts`;
export const addCommentRoute = `${host}/api/post/addComment`;
export const getCommentsRoute = `${host}/api/post/getComments`;
export const likePostRoute = `${host}/api/post/likePost`;
export const getLikesRoute = `${host}/api/post/getLikes`;
export const getPostRoute = `${host}/api/post/getPost`;
export const findPostsRoute = `${host}/api/post/findPosts`;

// messages
export const sendMessageRoute = `${host}/api/message/sendMessage`;
export const getAllMessageRoute = `${host}/api/message/getAllMessage`;
export const getMessageNotifRoute = `${host}/api/message/getMessageNotif`;
export const newMessagesRoute = `${host}/api/message/newMessages`;
export const readMessageRoute = `${host}/api/message/readMessage`;

// notifications
export const getNotifRoute = `${host}/api/auth/getNotif`;
export const readNotifRoute = `${host}/api/auth/readNotif`;
