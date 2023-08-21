const Customer = require("../../models/Customer.js");

const deleteCart = async (req, res) => {
  try {
    const userId = req.user.userId;
    const customer = await Customer.findByIdAndUpdate(userId, { cart: [] });
    console.log(customer);
    res.status(200).json({ error: false });
  } catch (err) {
    console.log(err);
    res.status(400).json({ error: "Some Error" });
  }
};
module.exports = deleteCart;
