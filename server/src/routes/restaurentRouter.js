import express from "express"
import { createRestaurent, deleteTheRestaurent, finduserRestaurent, getRestaurentViaCuisine, getRestaurentViaQuery, getTheRestaurentById, updateTheRestaurentViaId } from "../controllers/restaurentController.js"
import { authCheck } from "../middlewares/authCheck.js";
import upload from "../middlewares/multerConfig.js";

let router = express.Router()

router.post("/createRestaurent",authCheck, upload.single("restaurentphotouri"), createRestaurent)
router.get("/gettherestaurent/:id", authCheck, getTheRestaurentById)
router.get("/getrestaurentviasearchtext/:searctText", authCheck, getRestaurentViaQuery)
router.get("/getrestaurentviaquery/:selectCuisiens", authCheck, getRestaurentViaCuisine)
router.get("/finduserRestaurent", authCheck, finduserRestaurent)
router.patch("/updatetherestaurent/:id", authCheck, upload.single("restaurentphotouri"), updateTheRestaurentViaId)
router.delete("/deletetherestaurent/:id", authCheck, deleteTheRestaurent)

export default router;