import { transporter } from "./configNodemailer.js";

export let forgotPasswordLink = async (res, email, link) => {
  try {
    let mail = await transporter.sendMail({
      from: "ashish@gmail.com",
      to: email,
      subject: "forgot password",
      text: link,
    });

    if (!mail) {
      return res.status(400).json({ message: "Failed to send mail" });
    } else {
      return mail;
    }
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: error });
  }
};
