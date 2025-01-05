import express from "express"
import { createRestaurent, getRestaurentViaCuisine, getRestaurentViaQuery, getTheRestaurentById } from "../controllers/restaurentController.js"
import { authCheck } from "../middlewares/authCheck.js";
import upload from "../middlewares/multerConfig.js";

let router = express.Router()

router.post("/createRestaurent",authCheck, upload.single("restaurentphotouri"), createRestaurent)
router.get("/gettherestaurent/:id", authCheck, getTheRestaurentById)
router.get("/getrestaurentviasearchtext/:searctText", authCheck, getRestaurentViaQuery)
router.get("/getrestaurentviaquery/:selectCuisiens", authCheck, getRestaurentViaCuisine)

export default router;