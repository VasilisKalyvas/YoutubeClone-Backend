import express from 'express'
import { signup, signin, logout } from '../controllers/auth.js';

const router = express.Router();

//CREATE A USER
router.post("/signup", signup)

//SIGN IN
router.post("/signin", signin)

//Logout
router.get("/logout", logout)


export default router;