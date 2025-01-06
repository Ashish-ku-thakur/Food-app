import express from "express";
import { authCheck } from "../middlewares/authCheck.js";
import { createOrder } from "../controllers/orderController.js";

let router = express.Router();

router.post("/ordercreate/:id", authCheck, createOrder)

export default router;
