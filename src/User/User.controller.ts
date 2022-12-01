import { RequestHandler } from "express";
import userData from '../../user-data.json';

export const getUsers: RequestHandler = async (req, res, next) => {
  try {
    return res.status(200).json(userData);
  } catch (e) {
    return res.status(500).json({
      err: e
    })
  }
}