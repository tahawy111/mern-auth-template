import { NextFunction, Request, Response } from "express";

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import userSchema from "../models/User";
import authController from "./authController";

const userController = {
  async createUser(req: Request, res: Response) {
    try {
      const { username, password } = req.body;

      if (!username || !password)
        return res.status(400).json({ msg: "Missing Inputs!" });

      const hashedPassword = bcrypt.hashSync(password, 12);

      await userSchema.create({ username, password: hashedPassword });

      res.status(201).json({ msg: "User created!" });
    } catch (error) {
      console.error(error);
    }
  },
  async getUser(req: Request, res: Response) {
    try {
      const user = await authController.fetchUser(req);
      res.json({ user });
    } catch (error) {
      console.error(error);
    }
  },
};

export default userController;
