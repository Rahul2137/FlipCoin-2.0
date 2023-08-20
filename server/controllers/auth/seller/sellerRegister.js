const User = require("../../../models/Seller");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const sellerRegister = async (req, res) => {
  try {
    const { sellerName, email, password } = req.body;

    const userExists = await User.exists({ email });
    if (userExists) {
      return res.status(409).send("User is already registered");
    }

    const encryptedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      sellerName: sellerName,
      email: email,
      password: encryptedPassword,
      role: "seller",
      availedLoyaltyProgram: false,
    });

    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email,
        sellerName: user.sellerName,
        role: "seller",
        availedLoyaltyProgram: user.availedLoyaltyProgram,
      },
      process.env.AUTH_TOKEN,
      {
        expiresIn: "72h",
      }
    );
    res.status(201).json({
      error: false,
      userDetails: {
        sellerName: user.sellerName,
        email: user.email,
        token: token,
        role: "seller",
        userId: user._id,
        availedLoyaltyProgram: user.availedLoyaltyProgram,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send("Error Occured. Please try again");
  }
};

module.exports = sellerRegister;
