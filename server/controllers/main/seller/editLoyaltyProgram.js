const Seller = require("../../../models/Seller");

const editLoyaltyProgram = async (req, res) => {
  try {
    // const { op } = req.body;
    const sellerId = req.user.userId;
    console.log(sellerId);
    const seller = await Seller.findByIdAndUpdate(sellerId, {
      availedLoyaltyProgram: true,
    });
    const sellerDetails = await Seller.findById(sellerId);

    res.status(201).json({ error: false, userDetails: sellerDetails });
  } catch (err) {
    console.log(err);
    res.status(400).json({ error: "Some Error" });
  }
};

module.exports = editLoyaltyProgram;
