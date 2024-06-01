import { unique } from "@tensorflow/tfjs";
import mongoose from "mongoose";

const categorySchema= new mongoose.Schema({
    name:{
        type:String,
        trim:true,
        required:true,
        maxLength:50,
        unique:true,
    },
});

export default mongoose.model("Category",categorySchema);