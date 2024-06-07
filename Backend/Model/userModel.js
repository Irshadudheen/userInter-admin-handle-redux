import mongoose from "mongoose";
import bcrypt from 'bcryptjs'
const userModel = mongoose.Schema({
    name:{type:String,required:true},
    email:{type:String,required:true,unique:true},
    password:{type:String,required:true},
    image:{type:String},

},{timestamps:true})
userModel.pre('save', async function (next){
    if(!this.isModified('password')){
        next()
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password,salt)
})

export default mongoose.model('user',userModel)