import jwt  from "jsonwebtoken"
import asynchandler from 'express-async-handler'



const adminprotect = asynchandler(async(req,res,next)=>{
    let token ;
    if(req.cookies){
        token = req.cookies.jwt
        if(token){
            try {
                const decoded = jwt.verify(token,process.env.JWT_SECRET)
                req.users = decoded.userId;
                next();
            } catch (error) {
                res.status(401);
                throw new Error("invalid token ")
            }
        }else{
            res.status(401);
            throw new Error("don't have an invalid authorized account for admin")
        }
    }else{
        res.status(401);
        throw new Error("there is  no stored cookies")
    }
})

export {adminprotect};