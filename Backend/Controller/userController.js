import asyncHandler from 'express-async-handler'
import User from '../Model/userModel.js'
import generateToken from '../utils/generateToken.js'
import bcrypt from 'bcryptjs';
import cloudinary from 'cloudinary'
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})
const authUser = asyncHandler(async (req,res)=>{
    const {email,password}=req.body
    const user = await User.findOne({email});
    if(user && (await bcrypt.compare(password, user.password))){
        
       
            generateToken(res,user._id);
            res.status(201).json({
                _id:user._id,
                name:user.name,
                email,
                image:user.image
            })
        
       
    }else{
        res.status(401)
        throw new Error('Invalid email or passord')
    }
    
})
const registerUser= asyncHandler (async (req,res)=>{
    
   const {name,email,password}=req.body;
   let profileImage = '';
   
   const userExists = await User.findOne({email});
   if(userExists){
    res.status(400)
    throw new Error('User already exists');
   }
   if(req.file){
    const result = await cloudinary.uploader.upload(req.file.path)
    console.log("the result of the cloudinary ",result );
    profileImage = result.secure_url
}
   const user = await User.create({name,email,password,image:profileImage})
   if(user) {
    generateToken(res,user._id)
    res.status(201).json({_id:user._id,name,email})
   }else{
    res.status(400);
    throw new Error('Invalid user data')
   }
    
});
const logoutUser= asyncHandler (async (rea,res)=>{
   res.cookie('jwt','',{
    httpOnly:true,
    expires: new Date(0)
   })
    res.status(200).json({message:'logout user'})
});
const getUserProfile= asyncHandler (async (rea,res)=>{
    const user = {
        _id:req.user._id,
        name:req.user._name,
        email:req.user.email
    }
    res.status(200).json(user)
});
const updataUserProfile= asyncHandler (async (req,res)=>{
    console.log("irshad");
   const user = await User.findById(req.user._id);
   if(user){
    user.name = req.body.name || user.name;
    user.email = req.body.name || user.email;

    if(req.body.password){
        user.password = req.body.password
    }
    const updatedUser = await user.save();
    console.log(updatedUser)
    res.status(200).json({
        _id:updatedUser._id,
        name:updatedUser.name,
        email:updatedUser.email
    });
   }else{
    res.status(404);
    throw new Error('User not found')
   }
    
});
export {getUserProfile,updataUserProfile,logoutUser,registerUser,authUser}