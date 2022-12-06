import { RequestHandler } from "express";
import _ from "lodash";
import { z } from "zod";
import { validateReq } from "../helpers/zod";
import authService from "./Auth.service";

const signinSchema = z
  .object({
    emp_id: z.string(),
    password: z.string(),
  })
  .strict();

export type SigninType = z.infer<typeof signinSchema>;

export const signin: RequestHandler = async (req, res) => {
  try {
    const validationRes = validateReq(signinSchema.safeParse(req.body));
    if (validationRes.error) {
      return res.status(400).json({
        message: validationRes.value,
      });
    }
    const signinRes = await authService.signin(validationRes.value);

    return res
      .status(200)
      .json({ token: signinRes.token, employee: signinRes.employee });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};
