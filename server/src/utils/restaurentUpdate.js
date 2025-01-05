export let updateRestaurent = (req, res) => {
  try {
    let restaurentValidUpdateData = [
      "restaurentname",
      "restaurentcatagery",
      "restaurentcuisiens",
      "restaurentaddress",
      "restaurentcountry",
      "restaurentcity",
    ];

    let isValid =  Object.keys(req.body).every((ele)=>restaurentValidUpdateData.includes(ele))
   
    if (!isValid) {
      console.log(isValid);

      return res.status(400).json({ message: "Invalid data" });
    } else {
      return isValid;
    }
  } catch (error) {
    console.log("restaurentupdate", error);
    return res.status(501).json({ msg: error });
  }
};
