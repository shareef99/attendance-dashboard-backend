import { validateReq } from "./../helpers/zod";
import { RequestHandler } from "express";
import userService from "./User.service";
import { z } from "zod";

const userSchema = z
  .object({
    name: z.string(),
    email: z.string().email(),
    password: z.string(),
  })
  .strict();

export type userType = z.infer<typeof userSchema>;

export const getUsers: RequestHandler = async (req, res, next) => {
  try {
    const users = await userService.getUsers();
    return res.status(200).json({ users: users });
  } catch (err: any) {
    return res.status(500).json({
      err: err.message || "Something went wrong.",
    });
  }
};

export const getUserById: RequestHandler = async (req, res, next) => {
  try {
    const user = await userService.getUserById(req.params.id);
    return res.status(200).json({ user });
  } catch (err) {
    return res.status(500).json({ message: err });
  }
};

export const addUser: RequestHandler = async (req, res, next) => {
  try {
    const validationRes = validateReq(userSchema.safeParse(req.body));

    if (validationRes.error) {
      console.log(validationRes.value);
      return res.status(400).json({
        message: validationRes.value,
      });
    }

    const userRes = await userService.createUser(validationRes.value);

    if (userRes.error) {
      return res.status(400).json({ message: userRes.message });
    }

    return res.status(200).json({ message: userRes.message });
  } catch (err: any) {
    return res
      .status(500)
      .json({ message: err.message || "An unidentified problem occurs" });
  }
};

export const updateUser: RequestHandler = async (req, res, next) => {
  try {
    // const isValid = validateReq(userSchema.safeParse(req.body));

    // if (isValid.error) {
    //   res.status(200).json({ message: isValid.value });
    // }

    const updateUserRes = await userService.updateUser(req.params.id, req.body);
    if (updateUserRes.error) {
      res.status(400).json({ message: updateUserRes.message });
    }
    res.status(200).json({ message: updateUserRes.message });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteUser: RequestHandler = async (req, res, next) => {};
