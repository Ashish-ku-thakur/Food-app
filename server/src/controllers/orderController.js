import Order from "../models/orderSchema.js";
import mongoose from "mongoose";

export let createOrder = async (req, res) => {
  try {
    let userId = req._id; // Ensure this comes from middleware
    let restaurentDetailsId = req.params.id;
    let { menuDetails, totalAmount, menuQuentity } = req.body;

    // Validate userId
    if (!userId) {
      return res.status(400).json({ msg: "User ID is missing from request" });
    }

    // Validate restaurentDetailsId
    if (!mongoose.Types.ObjectId.isValid(restaurentDetailsId)) {
      return res.status(400).json({ msg: "Invalid restaurant ID" });
    }

    // Validate menuDetails
    if (
      !Array.isArray(menuDetails) && menuDetails.every((ids) => !mongoose.Types.ObjectId.isValid(ids))
    ) {
      return res
        .status(400)
        .json({ msg: "Menu details should be a valid array of ObjectIds" });
    }

    // Validate totalAmount
    if (!totalAmount || typeof totalAmount !== "number") {
      return res.status(400).json({ msg: "Invalid or missing totalAmount" });
    }

    // Validate menuQuentity
    if (!menuQuentity || typeof menuQuentity !== "string") {
      return res.status(400).json({ msg: "Invalid or missing menuQuentity" });
    }

    // Create the order
    let orderCreate = await Order.create({
      userDetails: userId,
      restaurentDetails: restaurentDetailsId,
      menuDetails: menuDetails,
      totalAmount: totalAmount,
      menuQuentity: menuQuentity,
      status: "PREPARING",
    });

    return res.status(201).json({
      msg: "Order created successfully",
      order: orderCreate,
    });
  } catch (error) {
    console.error("Error while creating order:", error.message || error);
    return res.status(500).json({ msg: "Internal server error" });
  }
};
