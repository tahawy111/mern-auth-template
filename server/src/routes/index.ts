import { Application } from "express";
import authRoutes from "./authRoutes";
import userRoutes from "./userRoutes";

export default function (app: Application) {
  app.use("/auth", authRoutes);
  app.use("/user", userRoutes);
}
