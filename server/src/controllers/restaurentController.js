import cloudinary from "../cloudinary/cloudinaryConfig.js";
import Restaurent from "../models/restaurent.js";
import { getthedatauri } from "../utils/getTheDataUri.js";
import { updateRestaurent } from "../utils/restaurentUpdate.js";
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

// get the restaurent via restaurentname, restaurentcountry
export let getRestaurentViaQuery = async (req, res) => {
  try {
    let name = req.params.searctText; // restaurentname, country

    console.log(name);

    if (!name) {
      return res.status(404).json({
        msg: `${name} that you have given is not match any restaurent;s name`,
      });
    }

    // set the advanse qurey to find restauren via name and country
    let findrestaurent = await Restaurent.find({
      $or: [
        { restaurentname: { $regex: `^${name}`, $options: "i" } },
        { restaurentcountry: { $regex: `^${name}`, $options: "i" } },
      ],
    });

    if (!findrestaurent) {
      return res.status(404).json({ msg: "RESTAURENT  not found" });
    }
    return res.status(200).json({ findrestaurent });
  } catch (error) {
    console.log(error);
    return res.status(501).json({ error });
  }
};

// now we will find restaurent viw cuisiens or city name, country name
export let getRestaurentViaCuisine = async (req, res) => {
  try {
    const { selectCuisiens, findText } = req.query;

    // Check if both required parameters are missing
    if (!selectCuisiens && !findText) {
      return res
        .status(404)
        .json({ msg: "selectCuisiens or findText is not found" });
    }

    let makeQuery = [];

    // Handle cuisines condition
    if (selectCuisiens) {
      const splitAllTheCuisiens = selectCuisiens.split(",");
      const cuisineRegexQueries = splitAllTheCuisiens.map((cuisine) => ({
        restaurentcuisiens: { $regex: `^${cuisine}`, $options: "i" },
      }));
      makeQuery.push(...cuisineRegexQueries);
    }

    // Handle text search condition
    if (findText) {
      makeQuery.push(
        { restaurentname: { $regex: `^${findText}`, $options: "i" } },
        { restaurentcounter: { $regex: `^${findText}`, $options: "i" } },
        { restaurentcity: { $regex: `^${findText}`, $options: "i" } }
      );
    }

    // Combine conditions with $or if needed
    let query = {};

    if (makeQuery.length > 0) {
      query = { $or: makeQuery };
    }

    // Fetch data from MongoDB
    const findRestaurent = await Restaurent.find(query);

    return res.status(200).json(findRestaurent);
  } catch (error) {
    console.error(error);
    return res.status(501).json({ msg: error.message });
  }
};

// find all the user's restaurents
export let finduserRestaurent = async (req, res) => {
  try {
    let userId = req._id;
    let findTheRestaurents = await Restaurent.find({ restaurentoner: userId });

    if (!findTheRestaurents) {
      return res.status(404).json({ msg: "restaurent not found" });
    }

    return res.status(200).json(findTheRestaurents);
  } catch (error) {
    console.log(error);
    return res.status(501).json({ msg: error });
  }
};

// update the restaurent via id
export let updateTheRestaurentViaId = async (req, res) => {
  try {
    let restaurentId = req.params.id;

    // validate the req.body data
    // updateRestaurent(req, res);
    console.log("first");

    let restaurentphotouri = req.file;

    let updateRestaurentPhoto;
    if (restaurentphotouri) {
      // get the data uri

      console.log("second");

      let datauri = getthedatauri(restaurentphotouri);

      if (!datauri) {
        return res.status(404).json({ msg: "data uri is not genrated" });
      }
      console.log("third");

      // set the datauri to cloudinary
      let cloudResponse = await cloudinary.uploader.upload(datauri, {
        folder: "restaurent_images",
      });

      if (!cloudResponse?.secure_url) {
        return res.status(404).json({ msg: "secure_url is not genrated" });
      }

      // set the secure url to the updateRestaurentPhoto
      updateRestaurentPhoto = cloudResponse.secure_url;
    }

    if (!restaurentId) {
      return res.status(404).json({
        msg: "please enter restaurent id or select a restaurent from the list",
      });
    }

    // find the restaurent via id and update
    let findTheRestaurent = await Restaurent.findByIdAndUpdate(
      { _id: restaurentId },
      {
        ...req.body, // Spread `req.body` for updating fields
        restaurentphotouri: updateRestaurentPhoto, // Add/update the photo URI
      },
      { restaurentphotouri: updateRestaurentPhoto },
      { new: true }
    );
    await findTheRestaurent.save();

    console.log("forth");

    return res.status(200).json(findTheRestaurent);
  } catch (error) {
    console.log(error);
    return res.status(501).json({ msg: error });
  }
};

// delete the restaurent
export let deleteTheRestaurent = async (req, res) => {
  try {
    // find the restaurent id
    let restaurentId = req.params.id;

    if (!restaurentId) {
      return res.status(404).json({ msg: "rstaurent id is not persent" });
    }

    // find the restaurent via id and delete
    let findTheRestaurent = await Restaurent.findByIdAndDelete({
      _id: restaurentId,
    });

    return res
      .status(200)
      .json({
        msg: `${findTheRestaurent?.restaurentname} is deleted successfully`,
      });
  } catch (error) {
    console.log(error);
    return res.status(501).json({ msg: error });
  }
};
