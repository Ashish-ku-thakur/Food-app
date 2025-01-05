import express from "express";
import { createMenu } from "../controllers/menuController.js";
import { authCheck } from "../middlewares/authCheck.js";
import upload from "../middlewares/multerConfig.js";
let router = express.Router();

router.post("/menucreate/:id", authCheck, upload.single("menuphoto"), createMenu);

export default router;
