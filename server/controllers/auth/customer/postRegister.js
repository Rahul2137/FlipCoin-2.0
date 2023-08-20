const User = require("../../../models/Customer");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const postRegister = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    const userExists = await User.exists({ email });
    if (userExists) {
      return res.status(409).send("User is already registered");
    }

    const encryptedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: encryptedPassword,
      role: "customer",
    });

    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
      process.env.AUTH_TOKEN,
      {
        expiresIn: "72h",
      }
    );
    res.status(201).json({
      error: false,
      userDetails: {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        token: token,
        userId: user._id,
        role: user.role,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send("Error Occured. Please try again");
  }
};

module.exports = postRegister;
