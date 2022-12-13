import * as dotenv from "dotenv";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";

// load env variables in .env file
dotenv.config();

// Database connection
mongoose.connect(process.env.DATABASE_URL!);
const db = mongoose.connection;
db.on("error", (error) => console.error(error));
db.once("open", () => console.log("connected to database"));

const app = express();
const port = process.env.PORT || 9000;

// middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json()); // json payload parse
app.use(cors()); // cors origin config

// Routers
import authRouter from "./src/Auth/Auth.route";
import userRouter from "./src/User/User.route";
import employeeRouter from "./src/employee/employee.route";
import leaveRouter from "./src/leaves/leave.route";
import designationRouter from "./src/designation/designation.route";

// paths
app.get("/", (req, res) => {
  res.send("hello world");
});
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/employees", employeeRouter);
app.use("/api/v1/leaves", leaveRouter);
app.use("/api/v1/designations", designationRouter);

app.listen(port, () => {
  console.log("server started on ", port);
});
