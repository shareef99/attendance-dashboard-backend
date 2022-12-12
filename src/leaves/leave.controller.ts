import { validateReq } from "./../helpers/zod";
import { RequestHandler } from "express";
import { z } from "zod";
import leaveService from "./leave.service";

const leaveSchema = z
  .object({
    name: z.string(),
    shortName: z.string(),
    leaveType: z.string(),
    limit: z.number(),
    eligibility: z.boolean(),
    uploadDocument: z.boolean(),
  })
  .strict();

export type leaveType = z.infer<typeof leaveSchema>;

export const createLeave: RequestHandler = async (req, res) => {
  try {
    const validationRes = validateReq(leaveSchema.safeParse(req.body));

    if (validationRes.error) {
      res.status(400).json({ message: validationRes.value });
    }

    await leaveService.createLeave(validationRes.value);
    res.status(201).json({ message: "Leave Created Successfully" });
  } catch (err: any) {
    res
      .status(500)
      .json({ message: err.message || err || "something went wrong" });
  }
};

export const getLeaves: RequestHandler = async (req, res) => {
  try {
    const leaves = await leaveService.getLeaves();
    res.status(200).json({ leaves });
  } catch (err: any) {
    res
      .status(500)
      .json({ message: err.message || err || "something went wrong" });
  }
};

export const getLeave: RequestHandler = async (req, res) => {
  try {
    const leave = await leaveService.getLeave(req.params.id);
    res.status(200).json({ leave });
  } catch (err: any) {
    res
      .status(500)
      .json({ message: err.message || err || "something went wrong" });
  }
};

export const deleteLeave: RequestHandler = async (req, res) => {
  try {
    await leaveService.deleteLeave(req.params.id);
    res.status(200).json({ message: "Leave deleted Successfully" });
  } catch (err: any) {
    res
      .status(500)
      .json({ message: err.message || err || "something went wrong" });
  }
};
