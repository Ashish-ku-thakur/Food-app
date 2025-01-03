// import mongoose, { Mongoose } from "mongoose";

// let orderSchema = new mongoose.Schema({
//   userDetails: { // user jo order create karega
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "User",
//     required: true,
//   },

//   restaurentDetails: { // jisrestaurent ke menu ko buy karega
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "Restaurent",
//     required: true,
//   },
//   menuDetails: [ // user jis jis menu ke item ko buy karega
//     {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Menu",
//       required: true,
//       menuQuentity: String,
//       totalAmount: Number,
//     },
//   ],
//   razorpayOrderId: { // razorpay ki jo order id janrate hogi
//     type: String,
//   },
//   status: { // kia kia steps honge
//     enum: ["PAID", "CONFIRM", "PREPARING", "FAILED", "DELEVARD"],
//   },
// });
// let Order = mongoose.model("Order", orderSchema);
// export default Order;
