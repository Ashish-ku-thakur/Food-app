export let validateDataForCreateRestaurent = (req) => {
  try {
    let checkFild = [
      "restaurentname",
      "restaurentcatagery",
      "restaurentcuisiens",
      "restaurentaddress",
      "restaurentcountry",
      "restaurentcity",
    ];

    let validate = checkFild.every((item) =>
      Object.keys(req.body).includes(item)
    );

    if (!validate) {
      return null;
    }

    return validate;
  } catch (error) {
    console.log(error);
    return null;
  }
};
