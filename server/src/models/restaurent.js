import mongoose from "mongoose";

let restaurentSchema = new mongoose.Schema({
  restaurentname: {
    type: String,
    required: [true, "Restaurant name is required."],
    unique: true,
    minLength: 3,
    maxLength: 30,
    trim: true,
  },

  restaurentcatagery: {
    type: String,
    enum: ["veg", "non-veg", "omnivorus"],
    required: true,
  },

  restaurentoner: {
    // create kerne wala user
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  restaurentphotouri: {
    type: String,
    required: true,
  },

  restaurentmenus: [
    // restaurent ke ander bhaut sare menu honge toh unki ids
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Menu",
    },
  ],

  restaurentcuisiens: {
    // restaurent ke ander kuchh cuisines honge
    type: [String],
    default: undefined,
  },

  restaurentaddress: {
    // restaurent ka address
    type: String,
    required: true,
  },
  restaurentcountry: {
    // restaurent kis contry me hai
    type: String,
    required: true,
  },
  restaurentcity: {
    // restaurent kis city me hai
    type: String,
    required: true,
  },
});

restaurentSchema.index({ restaurentname: 1, restaurentcountry: 1 }, { background: true });

let Restaurent = new mongoose.model("Restaurent", restaurentSchema);
export default Restaurent;
