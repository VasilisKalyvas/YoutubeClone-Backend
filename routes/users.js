import express from 'express'
import { update, deleteUser, subscribe, unsubscribe, like, dislike, getUser } from '../controllers/user.js';
import { verifyToken } from '../middleware/verifyToken.js';

const router = express.Router();

//update user
router.put('/:id', verifyToken, update);

//delete user
router.delete('/:id', verifyToken, deleteUser);

//get user
router.get('/find/:id', getUser);

//subscribe user
router.put('/sub/:id', verifyToken, subscribe)

//unsubscribe user
router.put('/unsub/:id', verifyToken, unsubscribe);

//like video
router.put('/like/:videoId', verifyToken, like);

//dislike video 
router.put('/dislike/:videoId', verifyToken, dislike);

export default router;