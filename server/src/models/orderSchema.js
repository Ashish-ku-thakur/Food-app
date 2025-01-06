import mongoose from "mongoose";

let orderSchema = new mongoose.Schema({
  userDetails: { // user jo order create karega
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  restaurentDetails: { // jisrestaurent ke menu ko buy karega
    type: mongoose.Schema.Types.ObjectId,
    ref: "Restaurent",
    required: true,
  },
  menuDetails: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Menu",
      required: true,
    },
  ],
  totalAmount: {
    type: Number,
    required: true,
  },
  menuQuentity: {
    type: String,
    required: true,
  },
  razorpayOrderId: { // razorpay ki jo order id janrate hogi
    type: String,
  },
  status: {
    type: String,
    enum: ["PREPARING", "COMPLETED", "CANCELLED"],
    default: "PREPARING",
  },
});
let Order = mongoose.model("Order", orderSchema);
export default Order;
