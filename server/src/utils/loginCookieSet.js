import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export let loginCookieSet = async (user, res) => {
  try {
    //let {_id} = user

    const token = jwt.sign({ _id: user?._id }, process.env.SECRET_KEY, {
      expiresIn: "5h",
    });
    
    return token;
  } catch (error) {
    console.log(error);
  }
};
