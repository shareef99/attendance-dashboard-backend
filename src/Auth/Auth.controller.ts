import { RequestHandler } from "express";

export const login: RequestHandler = (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({
        message: 'Invalid request'
      })
    }
    res.status(200).json({
      token: "here is the token"
    })
  } catch (e) {
    res.status(500).json({
      err: e
    })
  }

}