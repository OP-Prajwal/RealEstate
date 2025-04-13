import express from 'express'
import { login, register,createNewProperty,fetchAllProperties ,Fetchcontracts,acceptOrReject, getProfile} from '../controllers/AgentController.js'
import { authMiddleware } from '../middlewares/authMiddleware.js'

const router=express.Router()

router.post("/login",login)
router.post("/register",register)
router.post("/property",authMiddleware,createNewProperty)
router.get("/property",authMiddleware,fetchAllProperties)
router.get("/contract",authMiddleware,Fetchcontracts)
router.post('/contract',authMiddleware,acceptOrReject)
router.get('/profile',authMiddleware,getProfile)
export default router