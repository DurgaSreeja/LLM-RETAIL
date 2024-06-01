<<<<<<< HEAD
// import { unique } from "@tensorflow/tfjs";
=======
>>>>>>> cd6fc1eb1a7adf60ae64c0ae16870af6b9db6809
import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: true,
    maxLength: 50,
    unique: true,
  },
});

export default mongoose.model("Category", categorySchema);
