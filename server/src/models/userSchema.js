import mongoose from "mongoose";

let userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 30,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minLength: 4,
  },
  phoneNumber: {
    type: Number,
    required: true,
  },
  photoURI: {
    type: String,
    default: "update your photo",
  },
  address: {
    type: String,
    default: "update your address",
  },
  country: {
    type: String,
    default: "update your country",
  },
  city: {
    type: String,
    default: "update your city",
  },
  admin: {
    // for admin only
    type: Boolean,
    default: false,
  },

  // advanced auth

  isverified: {
    //for email check
    type: Boolean,
    default: false,
  },
  sixDigitalCode: {
    // for otp verification (email)
    type: String,
    default: undefined,
  },
  sixDigitalCodeExpiresAt: {
    type: Date,
    default: undefined ,
  },
  forgotPasswordLink: {
    // link for give him a ui-link where the user can change password
    type: String,
    default: '',
  },
  forgotPasswordLinkExpiresAt: {
    type: Date,
    default: null,
  },
});
let User = new mongoose.model("User", userSchema);
export default User;
