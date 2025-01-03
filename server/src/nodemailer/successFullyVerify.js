import { transporter } from "./configNodemailer.js";

export let successFullyVerify = async (res, email) => {
  try {
    let mail = await transporter.sendMail({
      from: "ashish@gmail.com",
      to: email,
      subject: "verify successfully",
      text: "verify successfully",
    });

    if (!mail) {
      return res.status(404).json({ msg: "verify not successfully" });
    } else {
      return mail;
    }
  } catch (error) {
    console.log(error);
    return res.status(400).json({ msg: error?.errors });
  }
};
