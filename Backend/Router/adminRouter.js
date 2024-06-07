import express from 'express';
const Router = express.Router()
import upload from "../Middleware/multer.js";
import {authAdmin,addnewUser,admindashboard,adminlogout,deleteUser,updateuser} from '../Controller/adminController.js'
Router.post('/adminlogin',authAdmin);
Router.post("/adminlogout",adminlogout)
Router.route('/userslist').get(admindashboard).post(upload.single('image'),addnewUser)
Router.delete('/userslist/:userId',deleteUser)
Router.put('/updateuser/:id',upload.single('image'), updateuser);
export default Router