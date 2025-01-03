import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export let authCheck = async (req, res, next) => {
  try {
    // get the cookie
    let token = req.cookies.token;
    

    if (!token) res.status(400).json({ msg: "cookie is not persent" });

    // check the cookie
    let decoded = jwt.verify(token, process.env.SECRET_KEY);

    if (!decoded) res.status(400).json({ msg: "Unauthorized" });

    // set the req._id = user?._id

    req._id = decoded._id;

    next();
  } catch (error) {
    return res.status(401).json({ error });
  }
};
