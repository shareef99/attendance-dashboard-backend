import { getDesignations, createDesignation } from "./designation.controller";
import express from "express";

// Path: /designation
const designationRouter = express.Router();

designationRouter.get("/", getDesignations);
designationRouter.post("/", createDesignation);

export default designationRouter;
