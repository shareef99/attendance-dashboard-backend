import express from 'express';
import { login } from './Auth.controller';

// path: /auth
const authRouter = express.Router();

authRouter.post("/login", login);

export default authRouter;