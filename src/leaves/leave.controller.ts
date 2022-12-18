import { validateReq } from "./../helpers/zod";
import { RequestHandler } from "express";
import { z } from "zod";
import leaveModel from "./leave.model";

const leaveSchema = z
  .object({
    name: z.string(),
    shortname: z.string(),
    leave_type: z.enum(["accumulated", "public-holiday"]),
    limit: z.number(),
  })
  .strict();

export type leaveType = z.infer<typeof leaveSchema>;

export const createLeave: RequestHandler = async (req, res) => {
  try {
    const validationRes = validateReq(leaveSchema.safeParse(req.body));
    if (validationRes.error) {
      res.status(400).json({ message: validationRes.value });
    }
    await leaveModel.create({ ...validationRes.value });
    res.status(201).json({ message: "Leave Created Successfully" });
  } catch (err: any) {
    res
      .status(500)
      .json({ message: err.message || err || "something went wrong" });
  }
};

export const getLeaves: RequestHandler = async (req, res) => {
  try {
    const leaves = await leaveModel.find();
    res.status(200).json({ leaves });
  } catch (err: any) {
    res.status(500).json({ message: err.message || "something went wrong" });
  }
};

export const getLeave: RequestHandler = async (req, res) => {
  try {
    const id = req.query.id?.toString();
    const leave = await leaveModel.findById(id);

    if (!leave) {
      return res
        .status(400)
        .json({ message: "Leave doesn't exists with id " + id });
    }

    return res.status(200).json({ leave });
  } catch (err: any) {
    return res
      .status(500)
      .json({ message: err.message || "something went wrong" });
  }
};

export const deleteLeave: RequestHandler = async (req, res) => {
  try {
    const id = req.query.id;
    await leaveModel.findByIdAndDelete(id);
    res.status(200).json({ message: "Leave deleted Successfully" });
  } catch (err: any) {
    res
      .status(500)
      .json({ message: err.message || err || "something went wrong" });
  }
};
