import { transporter } from "./configNodemailer.js";

export let signupCodeSend = async (res, email, sixDigitalCode) => {
  try {
    let mail = await transporter.sendMail({
      from: "ashish@gmail.com",
      to: [email],
      subject: "verify email",
      text: sixDigitalCode,
    });
    if (!mail) {
      return res.status(400).json({ message: "Failed to send mail" });
    } else {
      console.log("SEND THE EMAIL");

      return mail;
    }
  } catch (error) {
    console.log(error);
    return res.status(400).json({ msg: error?.errors });
  }
};
