import express  from 'express'
const Router = express.Router();    
import { getUserProfile,logoutUser,registerUser,updataUserProfile,authUser } from '../Controller/userController.js';
import { protect } from '../Middleware/authMiddleware.js';
import upload from '../Middleware/multer.js';
Router.post('/',upload.single('image'),registerUser)
Router.post('/auth',authUser);
Router.post('/logout',logoutUser);
Router.get('/profile',protect,getUserProfile)
Router.put('/profile',protect,updataUserProfile)


export default Router