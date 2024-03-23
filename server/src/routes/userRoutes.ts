import { Router } from "express";
import userController from "../controllers/userController";

const router = Router();

router.route("/").post(userController.createUser);

export default router;
