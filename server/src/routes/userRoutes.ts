import { Router } from "express";
import userController from "../controllers/userController";
import authController from "../controllers/authController";

const router = Router();

router.route("/").post(userController.createUser);
router.get(
  "/getUser",
  authController.authenticateToken,
  userController.getUser
);

export default router;
