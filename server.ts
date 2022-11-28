import * as dotenv from 'dotenv';
import express from "express";
import cors from 'cors';
import authRouter from './src/Auth/Auth.route';

// load env variables in .env file
dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json()) // json payload parse
app.use(cors()); // cors origin config

// paths
app.use('/auth', authRouter);

app.get("/", (req, res) => {
  res.send("hello world");
})

app.listen(port, () => {
  console.log("server started");
})
