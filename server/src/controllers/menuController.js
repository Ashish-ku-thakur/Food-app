import cloudinary from "../cloudinary/cloudinaryConfig.js";
import Menu from "../models/menu.js";
import Restaurent from "../models/restaurent.js";
import { getthedatauri } from "../utils/getTheDataUri.js";
import { menuDataValidata } from "../utils/menuDatavalidata.js";

// create the menu
export let createMenu = async (req, res) => {
  try {
    let { menuName, menuPrice, menuDescription } = req.body;

    let menuphoto = req.file;
    let userId = req._id; // by authcheck mid
    let restaurentId = req.params.id;
    // console.log(menuphoto);

    if (!restaurentId) {
      return res.status(404).json({ msg: "restaurent id is required" });
    }

    if (!menuphoto) {
      return res.status(404).json({ msg: "menu photo is required" });
    }

    // validate the req.body data
    menuDataValidata(req, res);

    // get the data uri
    let datauri = await getthedatauri(menuphoto);

    if (!datauri) {
      return res.status(404).json({ msg: "menu photo is required" });
    }

    // set the cloudinari
    let cloudResponse = await cloudinary.uploader.upload(datauri, {
      folder: "menu_images",
    });

    let menuImage;
    if (cloudResponse?.secure_url) {
      menuImage = cloudResponse?.secure_url;
    }

    // create restaurent
    let createMenu = await Menu.create({
      menuName,
      menuphoto: menuImage,
      menuPrice,
      menuDescription,
    });

    if (!createMenu) {
      return res.status(404).json({ msg: "menu is not created" });
    }

    // after create the menu set it to the restaurent
    let findRestaurent = await Restaurent.findById({_id:restaurentId})

    // console.log(findRestaurent);
    

    if (!findRestaurent.restaurentmenus.includes(createMenu._id)) {
      findRestaurent.restaurentmenus.push(createMenu._id);
      await findRestaurent.save();
    }

    return res
      .status(201)
      .json({ msg: "menu created successfully", findRestaurent });
  } catch (error) {
    console.log(error);
    return res.status(501).json({ msg: error });
  }
};
