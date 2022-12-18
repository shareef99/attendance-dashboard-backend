import { RequestHandler } from "express";
import { z } from "zod";
import { validateReq } from "../helpers/zod";
import designationModel from "./designation.model";
import designationService from "./designation.service";

const designationSchema = z.object({
  name: z.string(),
  type: z.enum(["teaching", "non-teaching"]),
  role: z.number(),
});

export const getDesignations: RequestHandler = async (req, res) => {
  try {
    const designations = await designationModel.find();
    res.status(200).json({ designations });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const createDesignation: RequestHandler = async (req, res) => {
  try {
    const validationRes = validateReq(designationSchema.safeParse(req.body));
    if (validationRes.error) {
      return res.status(400).json({
        message: validationRes.value,
      });
    }
    await designationService.createDesignation(validationRes.value);
    res.status(201).json({ message: "Designation Created" });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};
