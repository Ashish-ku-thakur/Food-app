import cloudinary from "../cloudinary/cloudinaryConfig.js";
import Menu from "../models/menu.js";
import Restaurent from "../models/restaurent.js";
import { getthedatauri } from "../utils/getTheDataUri.js";
import { menuDataValidata } from "../utils/menuDatavalidata.js";

// create the menu and update the restaurent
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
    let findRestaurent = await Restaurent.findById({ _id: restaurentId });

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

// get the menu
export let getTheMenuViaresId = async (req, res) => {
  try {
    let restaurentId = req.params.id;

    if (!restaurentId) {
      return res.status(404).json({ msg: "restaurent id is required" });
    }

    // get all the menus of the restaurent
    let findMenus = await Restaurent.find({ _id: restaurentId })
      .select("restaurentphotouri restaurentmenus")
      .populate("restaurentmenus");

    if (!findMenus) {
      return res.status(404).json({ msg: "menu not found in the resaturent" });
    }
    // console.log(findMenus);
    return res.status(200).json({ findMenus });
  } catch (error) {
    console.log(error);
    return res.status(501).json({ msg: "internal server error" });
  }
};

// menu update
export let updateTheMenuViaresId = async (req, res) => {
  try {
    let menuId = req.params.id;
    let menuphoto = req.file;

    let menuImage; // this is set to menuphoto

    if (menuphoto) {
      // get the datauri
      let datauri = getthedatauri(menuphoto);

      if (!datauri) {
        return res.status(404).json({ msg: "data uri is not genrated" });
      }

      // set the data uri to the cloudinary
      let cloudResponse = await cloudinary.uploader.upload(datauri, {
        folder: "menu_images",
      });

      if (cloudResponse?.secure_url) {
        menuImage = cloudResponse.secure_url;
      }
    }

    if (!menuId) {
      return res.status(404).json({ msg: "menu is not present" });
    }

    // find the menu via id
    let findMenu = await Menu.findByIdAndUpdate(
      { _id: menuId },
      { ...req.body, menuphoto: menuImage },
      { new: true }
    );

    await findMenu.save();

    if (!findMenu) {
      return res.status(404).json({ msg: "menu is not present" });
    }

    return res.status(200).json({ msg: "menu updated successfully", findMenu });
  } catch (error) {
    console.log(error);
    return res.status(501).json({ msg: "internal server error" });
  }
};

// find the menu and delete , update the restaurent
export let deleteTheMenu = async (req, res) => {
  try {
    let menuId = req.params.id;

    if (!menuId) {
      return res.status(404).json({ msg: "menu id is required" });
    }

    // find the menu via id and delete and update the restaurent
    let findMenu = await Menu.findByIdAndDelete({ _id: menuId });
    if (!findMenu) {
      return res.status(404).json({ msg: "menu is not present" });
    }
    // update the restaurant
    let updateRestaurant = await Restaurent.findOneAndUpdate(
      { restaurentmenus: menuId },
      { $pull: { restaurentmenus: menuId } },
      { new: true }
    );

    await updateRestaurant.save();

    if (!updateRestaurant) {
      return res.status(404).json({ msg: "restaurant is not present" });
    }

    return res.status(200).json({ msg: "delete successfully" });
  } catch (error) {
    console.log(error);
    return res.status(501).json({ msg: "internal server error" });
  }
};
