import mongoose from "mongoose";

let menuSchema = new mongoose.Schema({
  menuName: {
    // menu ki name
    type: String,
    required: true,
  },
  menuPhotoURI: {
    // menu ki photo
    type: String,
    required: true,
  },
  menuPrice: {
    // menu ki price
    type: Number,
    required: true,
  },
  menuDescription: {
    // menu ki description
    type: String,
    required: true,
  },
});

let Menu = mongoose.model("Menu", menuSchema);
export default Menu;
