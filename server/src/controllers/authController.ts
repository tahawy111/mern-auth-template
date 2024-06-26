import { NextFunction, Request, Response } from "express";

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {
  TokenExpiration,
  generateAccessToken,
  generateRefreshToken,
} from "../utils/generateToken";
import userSchema from "../models/User";

interface IToken {
  access: string;
  refresh: string;
}

const authController = {
  login: async (req: Request, res: Response) => {
    const { username, password } = req.body;
    const user = await userSchema.findFirst({ username });
    if (!username || !password) {
      return res.status(400).json({ msg: "All fields is missing" });
    }
    if (!user) {
      return res.status(404).json({ msg: "Invalid data" });
    }

    if (!bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ msg: "Invalid password" });
    }

    const accessToken = generateAccessToken({ userId: user.id });
    const refreshToken = generateRefreshToken({ userId: user.id });

    console.log({ accessToken, refreshToken });

    res.cookie("access", accessToken, {
      maxAge: TokenExpiration.Access,
      httpOnly: true,
    });
    res.cookie("refresh", refreshToken, {
      maxAge: TokenExpiration.Refresh,
      httpOnly: true,
    });

    res.json({ accessToken, refreshToken, user });

    // console.log(req);
  },
  setToken: async (req: Request, res: Response) => {
    res.cookie("access", req.query.access, {
      maxAge: TokenExpiration.Access,
      httpOnly: true,
    });
    res.cookie("refresh", req.query.refresh, {
      maxAge: TokenExpiration.Refresh,
      httpOnly: true,
    });

    res.json({ msg: "OK" });
    // console.log(req);
  },
  // rotate accessToken before it expired
  refreshToken: async (req: Request, res: Response) => {
    try {
      const authToken = req.cookies as IToken;

      jwt.verify(
        authToken.refresh,
        process.env.REFRESH_TOKEN_SECRET!,
        async (err, userToken: any) => {
          if (err) {
            return res.sendStatus(403);
          }
          // rotate accessTokne

          const accessToken = generateAccessToken({
            userId: String((userToken as { userId: string }).userId),
          });

          res.cookie("access", accessToken, { maxAge: TokenExpiration.Access });
          res.cookie("refresh", authToken.refresh, {
            maxAge: TokenExpiration.Refresh,
          });

          const user = await userSchema.findFirst({ id: userToken.userId });

          if (!user) return res.status(400).json({ msg: "Invalid token" });

          res.json({ msg: "Token Refreshed Successfully!", user });
        }
      );
    } catch (error) {
      console.error(error);
    }
  },
  authenticateToken: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const authToken = req.cookies as IToken;
    console.log(authToken.access);

    if (!authToken.access || !authToken.refresh) return res.sendStatus(401);

    jwt.verify(
      authToken.access,
      process.env.ACCESS_TOKEN_SECRET!,
      async (err, userToken) => {
        console.log(userToken);

        if (err) {
          return res.sendStatus(403);
        }
        next();
      }
    );
  },
  fetchUser: async (req: Request) => {
    const authToken = req.cookies as IToken;
    console.log(authToken.access);
    const userToken = jwt.verify(
      authToken.access!,
      process.env.ACCESS_TOKEN_SECRET!
    ) as {
      userId: string;
    };
    console.log(userToken.userId);

    const user = await userSchema.findFirst({ id: String(userToken.userId) });
    return user;
  },
};

export default authController;
