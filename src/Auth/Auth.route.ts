import express from "express";
import { signin } from "./Auth.controller";

// path: /auth
const authRouter = express.Router();

authRouter.post("/signin", signin);

export default authRouter;
