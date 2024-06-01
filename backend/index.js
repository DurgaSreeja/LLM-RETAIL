import connectdb from "./config/db.js";
import path  from  "path";
import express from  "express";
import cookieParser from  "cookie-parser";
import userRoutes from './routes/userRoutes.js';
import cors from 'cors'
import categoryRoutes from './routes/categoryRoutes.js'
connectdb();


const port = 5000;
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/api/users',userRoutes);
app.use('/api/category',categoryRoutes)
app.get("/", (req, res) => {
  res.send("Hello world!");
});

app.listen(port, () => console.log(`listening on port ${port}`));