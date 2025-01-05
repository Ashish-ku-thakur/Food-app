import { menuDataValidata } from "../utils/menuDatavalidata.js";


// create the menu
export let createMenu = async (req, res) => {
  try {
    let { menuName, menuPhotoURI, menuPrice, menuDescription } = req.body;

    // validate the req.body data
    menuDataValidata(req, res)

    
} catch (error) {
    console.log(error);
    return res.status(501).json({ msg: error });
  }
};
