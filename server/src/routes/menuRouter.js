import express from "express";
import { createMenu, deleteTheMenu, getTheMenuViaresId, updateTheMenuViaresId } from "../controllers/menuController.js";
import { authCheck } from "../middlewares/authCheck.js";
import upload from "../middlewares/multerConfig.js";
let router = express.Router();

router.post("/menucreate/:id", authCheck, upload.single("menuphoto"), createMenu);
router.get("/findmenus/:id", authCheck, getTheMenuViaresId);
router.patch("/updatethemenu/:id", authCheck, upload.single("menuphoto"), updateTheMenuViaresId);
router.delete("/deletetemnu/:id", authCheck, deleteTheMenu)

export default router;