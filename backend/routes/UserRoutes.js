import express from 'express'
import {register,login,showInterest,getAllInterests,getProperty,getProfile} from '../controllers/userController.js'
import { authMiddleware } from '../middlewares/authMiddleware.js'
const router=express.Router()

router.post('/register', register)
router.post('/login',login)
router.get('/allinterest',authMiddleware,getAllInterests)
router.post('/showInterest',authMiddleware,showInterest)
router.get('/getProperty',authMiddleware,getProperty)
router.get('/profile',authMiddleware,getProfile)
export default router;