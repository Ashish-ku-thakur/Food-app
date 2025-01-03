import express from "express";
import {
  forgotPassword,
  login,
  logout,
  setNewPassword,
  signup,
  updateProfile,
  verifyEmail,
  viewProfile,
} from "../controllers/userController.js";
import { authCheck } from "../middlewares/authCheck.js";

let router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/logout", logout);
router.patch("/update", authCheck, updateProfile);
router.get("/viewProfile", authCheck, viewProfile);
router.patch("/verifyEmail", verifyEmail);
router.patch("/forgotPassword", authCheck, forgotPassword);
router.post("/setNewPassword/:forgotPasswordLink", authCheck, setNewPassword);

export default router;
