import cloudinary from "../cloudinary/cloudinaryConfig.js";
import Restaurent from "../models/restaurent.js";
import { getthedatauri } from "../utils/getTheDataUri.js";
import { validateDataForCreateRestaurent } from "../utils/restaurentValidateData.js";

export let createRestaurent = async (req, res) => {
  try {
    // Destructure request body
    let {
      restaurentname,
      restaurentcatagery,
      restaurentcuisiens,
      restaurentaddress,
      restaurentcountry,
      restaurentcity,
    } = req.body;

    console.log(req.body.restaurentname);

    validateDataForCreateRestaurent(req);

    
    // Validate photo
    let restaurentphotouri = req.file;
    if (!restaurentphotouri) {
      return res.status(400).json({ msg: "Restaurant photo is required." });
    }


    // Check if the restaurant already exists
    let existingRestaurent = await Restaurent.findOne({
      restaurentname: restaurentname,
    });


    if (existingRestaurent) {
      console.log("error in if existnamne");

      throw new Error("existingRestaurent");
    }

    

    let cuisiens = restaurentcuisiens.split(",");

    // // Convert photo to data URI
    let finduri = await getthedatauri(restaurentphotouri);

    // Upload to Cloudinary
    let cloudResponse = await cloudinary.uploader.upload(finduri, {
      folder: "restaurent_images",
    });

    let setRestaurentUri = cloudResponse?.secure_url;
    if (!setRestaurentUri) {
      return res.status(500).json({ msg: "Failed to upload photo." });
    }

    // Create new restaurant
    let createRestaurent = await Restaurent.create({
      restaurentname,
      restaurentcatagery,
      restaurentphotouri: setRestaurentUri,
      restaurentoner: req._id,
      restaurentcuisiens: cuisiens,
      restaurentaddress,
      restaurentcountry,
      restaurentcity,
    });

    return res.status(201).json(createRestaurent);
  } catch (error) {
    // Handle duplicate key error
    if (error.code === 11000) {
      return res.status(400).json({
        msg: "A restaurant with this name already exists. Please choose a different name.",
      });
    }
    console.log(error);
    return res.status(500).json({ msg: error.message });
  }
};

// get the restaurent by id
export let getTheRestaurentById = async (req, res) => {
  try {
    // get the restaurent id by params
    const restaurentId = req.params.id;
    let loginUserId = req._id;

    if (!loginUserId) {
      return res.status(404).json({ msg: "user are not authenticated" });
    } else if (!restaurentId) {
      return res.status(404).json({ msg: "restaurent id is missing" });
    }

    // restraurent find via resataurentid

    let findRestaurent = await Restaurent.findById(restaurentId);

    if (!findRestaurent) {
      return res.status(404).json({ msg: "restaurent not found" });
    }

    return res
      .status(200)
      .json({ msg: "restaurent is present", findRestaurent });
  } catch (error) {
    console.log(error);
    return res.status(501).json({ msg: error });
  }
};

export let getRestaurentViaQuery = async (req, res) => {
  try {
    let name = req.body.name;
  } catch (error) {
    console.log(error);
    return res.status(501).json({ error });
  }
};
