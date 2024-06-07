import asyncHandler from 'express-async-handler';
import generateToken from '../utils/generateToken.js';
import User from '../Model/userModel.js';
import cloudinary from "cloudinary";


cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

const authAdmin = asyncHandler(async (req,res)=>{
    console.log('hai')
    const {email,password}=req.body;
    if(email===process.env.email && password ===process.env.password){
        generateToken(res,email);
        res.status(201).json({ email})
    }else{
        res.status(401)
        throw new Error('Invalid email or passord')
    }
})


const adminlogout = asyncHandler(async (req, res) => {
    res.cookie("token", "", {
      httpOnly: true,
      expires: new Date(0),
    });
    res.status(200).json({ message: "admin have been logout out " });
  });


const admindashboard = asyncHandler(async (req, res) => {
    const userData = await User.find()
      .select("-password")
      .sort({ updatedAt: -1 });
    res.status(200).json(userData);
  });


const deleteUser = asyncHandler(async (req,res)=>{
    const {userId}= req.params;
    console.log("userId to delete:",userId);
    const userData = await User.findById(userId);
    if(!userData){
        res.send(404);
        throw new Error('the matched userid is not found');
        
    }
    await User.deleteOne({ _id: userId });
    console.log("the  userdata has been deleted");
    res.status(200).json({ message: "the user has been successfully deleted " });
  })



const addnewUser = asyncHandler(async (req,res)=>{
    const {name,email,password}= req.body;
    if(!name || !email || !password){
        return res.status(400).json({message:'Please provide name,email and password'});
    }
    const userExists = await User.findOne({email});
   
    if(userExists){
        return res.status(400).json({message:'User already exists'})
    }
    console.log('start')
    try {
        console.log("dfjid")
        const user = await User.create({name,email,password});
        console.log(user,'kdjkdj')
        const regtoken = generateToken(res,user._id);
        res.status(201).json({
            message:'User registered successfully',
            user:{
                _id:user._id,
                name:user.name,
                email:user.email,
            }
        })
    } catch (error) {
        console.error("Error during user registration:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
  })

  const updateuser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    console.log("the user data is here ",user);
    if (user) {
        
  
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
  
       
  
        const updatedUser = await user.save();
        console.log(updatedUser,req.body)
        res.status(200).json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            
        });
    } else {
        res.status(404);
        throw new Error("User not found");
    }
  });

export {authAdmin,adminlogout,admindashboard,deleteUser,addnewUser,updateuser}