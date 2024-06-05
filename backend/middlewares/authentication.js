import jwt from 'jsonwebtoken'
import User from '../models/userModel.js'
import asyncHandler from './asyncHandler.js'

const authenticate=asyncHandler(async(req,res,next)=>{
    let token;

    token=req.headers.authorization ;
    
    if(token){
        try {
            
            const decoded=jwt.verify(token,process.env.JWT_SECRET)
            req.user=await User.findById(decoded.userId).select("-password")
            next();
        } catch (error) {
            
            res.status(401).json({message:"Not authorized,token failed"})
            
        }
    }
    else{
        res.status(401).json({message:"Not authorized,no token"})
    }


})

const authorise=asyncHandler((req,res,next)=>{
    if(req.user && req.user.isAdmin){
        next();
    }else{
        res.status(401).send("Not authorised as an admin")
    }
})

const getAllUsers=asyncHandler(async(req,res)=>{
    const users=await User.find({})
    res.json(users);
})

export {authenticate,authorise,getAllUsers};