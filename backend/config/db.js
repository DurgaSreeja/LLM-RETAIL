
import mongoose from  'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectdb=async()=>{
    try {
        await mongoose.connect(process.env.uri);
        console.log("Connected to DB");
    } catch (error) {
        console.error(error);
    }
};

export default connectdb;