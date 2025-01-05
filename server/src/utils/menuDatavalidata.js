export let menuDataValidata = (req, res) => {
  try {
    let menuData = ["menuName", "menuPhotoURI", "menuPrice", "menuDescription"];

    let isvalid = Object.keys(req.body).every((ele) => menuData.includes(ele));

    if (!isvalid) {
      return null;
    } else {
      return isvalid;
    }
    return null
  } catch (error) {
    console.log(error);
    return res.status(501).json({ msg: error });
  }
};
