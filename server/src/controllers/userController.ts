import { NextFunction, Request, Response } from "express";

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import userSchema from "../models/User";

const userController = {
  async createUser(req: Request, res: Response) {
    try {
      const { username, password } = req.body;

      if (!username || !password)
        return res.status(400).json({ msg: "Missing Inputs!" });

      await userSchema.create({ username, password });

      res.status(201).json({ msg: "User created!" });
    } catch (error) {
      console.error(error);
    }
  },
};

export default userController;
