import User from "../models/userSchema.js";
import { loginCookieSet } from "../utils/loginCookieSet.js";
import { signupValidation } from "../utils/signupHelper.js";
import crypto from "crypto";
import bcrypt from "bcrypt";
import validator from "validator";
import { signupCreateSixDigitalCode } from "../utils/signupCreateSixDigitalCode.js";
import { signupCodeSend } from "../nodemailer/signupCodeSend.js";
import { successFullyVerify } from "../nodemailer/successFullyVerify.js";
import { forgotPasswordLink } from "../nodemailer/forgotPasswordLink.js";

//signup
export let signup = async (req, res) => {
  try {
    let { fullName, email, password, phoneNumber } = req.body;

    signupValidation(req, res); // validate the request body

    // find user
    let existUser = await User.findOne({ email: email });
    if (existUser) {
      return res.status(404).json({ msg: "email is already exist" });
    }

    // hash password
    let hashPassword = await bcrypt.hash(password, 10);

    // create 6 digital code
    let sixDigitalCode = await signupCreateSixDigitalCode(res);

    // this 6 digital code send to the useremail
    let setTheSixDigitalCodeToEmail = await signupCodeSend(
      res,
      email,
      sixDigitalCode
    );

    if (!setTheSixDigitalCodeToEmail) {
      return res.status(404).json({ msg: "email is not valid" });
    }

    //create user
    let user = await User.create({
      fullName,
      email,
      password: hashPassword,
      phoneNumber,
      sixDigitalCode,
      sixDigitalCodeExpiresAt: new Date(Date.now() + 1000 * 60 * 60),
    });

    res.status(200).json({ user });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ msg: error?.errors });
  }
};

//login
export let login = async (req, res) => {
  try {
    let { email, password } = req.body;

    //email is valid ,
    let user = await User.findOne({ email: email });

    if (!user) {
      return res.status(400).json({ message: "credentials are invalid" });
    }

    // check password
    let isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.status(400).json({ message: "credentials are invalid" });
    }

    // cookie set
    let token = await loginCookieSet(user, res);
    // Date.now() // give a number of seconds
    res
      .cookie(
        "token",
        token,
        { expires: new Date(Date.now() + 1000 * 60 * 60 * 2) }
        // expires: new Date(Date.now() + 1000 * 60 * 60 * 2),
      )
      .status(200)
      .json({ msg: `welcome back ${user.fullName}` });
  } catch (error) {
    res.status(400).json({ message: error?.errors });
    console.log(error);
  }
};

//logout
export let logout = async (req, res) => {
  try {
    res
      .cookie("token", "")
      .status(200)
      .json({ msg: `user logout successfully` });
  } catch (error) {
    res.status(400).json({ message: error?.errors });
    console.log(error);
  }
};

//update user profile
export let updateProfile = async (req, res) => {
  try {
    let userId = req._id; // this is done via cookie (authcheeck)
    let ch = [
      "fullName",
      "phoneNumber",
      "photoURI",
      "address",
      "country",
      "city",
      "admin",
    ];

    let validUpdateData = Object.keys(req.body).every((elm) =>
      ch.includes(elm)
    );

    if (!validUpdateData) {
      return res.status(400).json({ message: "invalid update data" });
    }

    // get the user from the cookie
    let findUser = await User.findById(userId);

    if (!findUser) {
      return res.status(404).json({ message: "user not found" });
    }

    // if he user is exist then update the user
    let updateduser = await User.findByIdAndUpdate(userId, req.body, {
      new: true,
    });

    await updateduser.save();

    return res.status(200).json({ user: updateduser });
  } catch (error) {
    res.status(400).json({ message: error?.errors });
    console.log(error);
  }
};

// view profile of login user
export let viewProfile = async (req, res) => {
  try {
    let userId = req._id;

    let loggedInUser = await User.findById(userId);

    if (!loggedInUser) {
      return res.status(404).json({ msg: "user not found" });
    }

    return res.status(200).json({ user: loggedInUser });
  } catch (error) {
    res.status(400).json({ message: error?.errors });
    console.log(error);
  }
};

// verify email via sixdigitalcode
export let verifyEmail = async (req, res) => {
  try {
    let sixDigitalCode = req.body.code;

    // find the user by code
    let findUser = await User.findOne({
      $and: [
        { sixDigitalCode: sixDigitalCode },
        { sixDigitalCodeExpiresAt: { $gt: new Date(Date.now()) } },
      ],
    });

    if (!findUser) {
      return res.status(404).json({ msg: "time is expire or user not found" });
    }

    // isverified set true
    findUser.isverified = true;
    findUser.sixDigitalCode = "";
    findUser.sixDigitalCodeExpiresAt = null;
    await findUser.save();

    //sendEmailForSuccessfullyVerified
    await successFullyVerify(res, findUser?.email);

    return res.status(200).json({
      user: findUser,
    });
  } catch (error) {
    res.status(400).json({ message: error?.errors });
    console.log(error);
  }
};

// forgot the old password
export let forgotPassword = async (req, res) => {
  try {
    // set a link to the user model
    let userEmail = req.body.email;

    let verifiedEmail = validator.isEmail(userEmail);

    if (!verifiedEmail) {
      return res.status(404).json({ msg: "this is not email" });
    }

    let findUserByEmail = await User.findOne({ email: userEmail });

    if (!findUserByEmail) {
      return res.status(404).json({ msg: "user not find" });
    }

    // generate a link
    let buffer = await crypto.randomBytes(10);
    let forgotPasswordLinkGenerate = buffer.toString("hex");

    // send the forgot password link to the user
    await forgotPasswordLink(res, userEmail, forgotPasswordLinkGenerate);

    // set this link to the user model
    findUserByEmail.forgotPasswordLink = forgotPasswordLinkGenerate;
    findUserByEmail.forgotPasswordLinkExpiresAt = new Date(
      Date.now() + 1000 * 60 * 10
    );
    await findUserByEmail.save();

    return res.status(200).json({ msg: "link send successFully" });
  } catch (error) {
    res.status(400).json({ message: error?.errors });
    console.log(error);
  }
};

//set the the new password
export let setNewPassword = async (req, res) => {
  try {
    let getTheForgotPasswordLink = req.params.forgotPasswordLink;
    let newPassword = req.body.newPassword;

    if (!validator.isStrongPassword(newPassword)) {
      return res
        .status(404)
        .json({
          msg: "please enter a strong password using (#,@,capital letter)",
        });
    }

    if (!getTheForgotPasswordLink) {
      return res.status(404).json({ msg: "link not found" });
    }

    // find the user via link
    let findTheUserViwLink = await User.findOne({
      $and: [
        { forgotPasswordLink: getTheForgotPasswordLink },
        { forgotPasswordLinkExpiresAt: { $gt: new Date(Date.now()) } },
      ],
    });

    if (!findTheUserViwLink) {
      return res.status(404).json({ msg: "user not found" });
    }
    // hash the password
    let hashPassword = await bcrypt.hash(newPassword, 10);

    // set the new password
    findTheUserViwLink.password = hashPassword;
    findTheUserViwLink.forgotPasswordLink = "";
    findTheUserViwLink.forgotPasswordLinkExpiresAt = null;
    await findTheUserViwLink.save();

    return res
      .status(200)
      .json({ msg: "user found", user: findTheUserViwLink });
  } catch (error) {
    res.status(400).json({ message: error?.errors });
    console.log(error);
  }
};
