import validator from "validator";

export let signupValidation = (req, res) => {
  try {
    let { fullName, email, password, phoneNumber } = req.body;

    // Check if all fields are filled
    if (!fullName || !email || !password || !phoneNumber) {
      return res.status(400).json({ error: "Please fill all the fields" });
    }

    // Validate email
    if (!validator.isEmail(email)) {
      return res.status(400).json({ error: "Invalid Email" });
    } else if (!validator.isStrongPassword(password)) {
      return res
        .status(400)
        .json({
          error:
            "password must be strong like use all charactor in password(A-Z,@, #, 0-9)",
        });
    } else if (!validator.isMobilePhone(phoneNumber, "en-IN")) {
      return res.status(400).json({ error: "Invalid Phone Number" });
    }

    // If all validations pass
  } catch (error) {
    res.status(500).json({ error: "Server Error" });
  }
};
