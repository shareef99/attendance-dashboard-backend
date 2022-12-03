import * as dotenv from 'dotenv';
import express from "express";
import cors from 'cors';
import authRouter from './src/Auth/Auth.route';
import userRouter from './src/User/User.route';
import mongoose from 'mongoose';

// load env variables in .env file
dotenv.config();

// Database connection 
mongoose.connect("mongodb://localhost:27017/testdb");
const db = mongoose.connection;
db.on('error', (error) => console.error(error));
db.once('open', () => console.log('connected to database'));

const app = express();
const port = process.env.PORT || 3001;

// middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json()) // json payload parse
app.use(cors()); // cors origin config

// paths
app.use('/auth', authRouter);
app.use('/user', userRouter);

app.get("/", (req, res) => {
  res.send("hello world");
})

app.listen(port, () => {
  console.log("server started");
})
