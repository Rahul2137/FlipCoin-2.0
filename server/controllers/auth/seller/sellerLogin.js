const User = require("../../../models/Seller");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const sellerLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      // Send a new token
      const token = jwt.sign(
        {
          userId: user._id,
          email: user.email,
          sellerName: user.sellerName,
          role: user.role,
          availedLoyaltyProgram: user.availedLoyaltyProgram,
        },
        process.env.AUTH_TOKEN,
        {
          expiresIn: "72h",
        }
      );
      return res.status(200).json({
        userDetails: {
          email: user.email,
          token: token,
          sellerName: user.sellerName,
          role: user.role,
          userId: user._id,
          availedLoyaltyProgram: user.availedLoyaltyProgram,
        },
      });
    } else if (user) {
      return res.status(401).json("Invalid Credentials. Please try again");
    }

    return res.status(404).send("User Not Found. Please Register");
  } catch (error) {
    console.log("error", error);
    return res.status(500).send("Something went wrong. Please try again");
  }
};

module.exports = sellerLogin;
