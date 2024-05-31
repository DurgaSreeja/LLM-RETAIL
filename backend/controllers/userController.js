import User from '../models/userModel.js'
import asyncHandler from '../middlewares/asyncHandler.js'
import bcrypt from 'bcryptjs'
import getToken from '../utils/token.js'

const createUser=asyncHandler(async(req,res)=>{
    const {username,email,password}=req.body
    if(!username || !email || !password){
        res.send("Please fill all the input fields")
    }
    else{
        const userExist=await User.findOne({username})
        if(userExist) res.status(400).send("Username already exists");
        else{
        const salt=await bcrypt.genSalt(10);
        const hash=await bcrypt.hash(password,salt)

        const newUser= new User({username,email,password: hash})
        
        try {
            await newUser.save();
            const token=getToken(res, newUser._id);
            res.status(201).json({
                _id: newUser._id,
                username: newUser.username,
                email: newUser.email,
                password: newUser.password,
                isAdmin:newUser.isAdmin,
                token:token,
            });
        } catch (error) {
            if (!res.headersSent) {
                res.status(400).send("Error occured!!");
            } else {
                console.error("Headers already sent", error);
            }
        }
       }
    }
})

const loginUser=asyncHandler(async(req,res)=>{
    const {email,password}=req.body
    const exist=await User.findOne({email})
    if(exist){
        const pwd=await bcrypt.compare(password,exist.password)
        if(pwd){
            const token=getToken(res,exist._id)
           
            res.status(201).json({
                _id: exist._id,
                username: exist.username,
                email: exist.email,
                password: exist.password,
                isAdmin:exist.isAdmin,
                token:token,
            });
            
           return;

        }else{
               res.status(404).json({message:"Incorrect password"})
               console.log("Incorrect password") 
        }
    }else{
        res.status(404).json({message:"User not found"}) 
 }
})

const logOut=asyncHandler(async(req,res)=>{
    res.cookie('jwt','',{
        httpOnly:true,
        expries:new Date(0),
    })
    res.status(200).json({message:"Logged Out Successfully"})
})

const getUserProfile=asyncHandler(async(req,res)=>{
    const user=await User.findById(req.user._id)
    if(user){
        res.json({
            _id: user._id,
            username: user.username,
            email: user.email,
        });
    }else{
        res.status(404).json({message:"User not found"});
    }
})

const updateUserProfile=asyncHandler(async(req,res)=>{
    const user=await User.findById(req.user._id)

    if(user){
        user.username=req.body.username || user.username
        user.email=req.body.email || user.email
        if(req.body.password){
            const salt=await bcrypt.genSalt(10);
            const hash=await bcrypt.hash(req.body.password,salt)

            user.password= hash 
        }

        const update= await user.save();

        res.json({
            _id: update._id,
            username: update.username,
            email: update.email,
            isAdmin:update.isAdmin,
        });

    }else{
        res.status(404).json({message:"User not found"});
    }
})

const deleteUser=asyncHandler(async(req,res)=>{
        const user=await User.findById(req.params.id)

        if(user){
            if(user.isAdmin){
                res.status(400).json({message:"Cannot delete admin User"})
            }
            else{
                await User.deleteOne({_id:user._id})
                res.json({message:"User removed"})
            }
        }else{
            res.status(404).json({message:"User not found"});
        }
})

const getUser=asyncHandler(async(req,res)=>{
    const user=await User.findById(req.params.id).select("-password")

    if(user){
        res.json(user);
    }else{
        res.status(404).json({message:"User not found"});
    }
})

const updateUser=asyncHandler(async(req,res)=>{
    const user=await User.findById(req.params.id).select("-password")
    if(user){
        user.username=req.body.username || user.username
        user.email=req.body.email || user.email
        user.isAdmin=req.body.isAdmin || user.isAdmin

        const update= await user.save();

        res.json({
            _id: update._id,
            username: update.username,
            email: update.email,
            isAdmin:update.isAdmin,
        });

    }else{
        res.status(404).json({message:"User not found"});
    }

})

export {createUser,loginUser,logOut,getUserProfile,updateUserProfile,deleteUser,getUser,updateUser};