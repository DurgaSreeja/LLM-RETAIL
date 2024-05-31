import express from 'express';
import {createUser,loginUser,logOut,getUserProfile,updateUserProfile,deleteUser,getUser,updateUser} from '../controllers/userController.js';
import { authenticate,authorise,getAllUsers } from '../middlewares/authentication.js';


const router=express.Router();


router.route('/').get(authenticate,authorise,getAllUsers)
router.post('/createUser',createUser)
router.post('/auth',loginUser)
router.post('/logOut',logOut)
 
router.route('/profile').get(authenticate,getUserProfile).put(authenticate,updateUserProfile)

router.route('/:id').delete(authenticate,authorise,deleteUser).get(authenticate,authorise,getUser).put(authenticate,authorise,updateUser)

export default router;


