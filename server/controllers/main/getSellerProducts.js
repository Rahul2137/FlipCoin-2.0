const Product = require("../../models/Product.js");

const getSellerProducts = async (req, res) => {
  try {
    const sellerId = req.user.userId;
    const product = await Product.find().populate("seller");
    console.log(product);
    const productList = [];
    if (product) {
      product.forEach((element) => {
        if (sellerId === element.seller._id.toString()) {
          productList.push(element);
        }
      });
    }

    res.status(200).json({ error: "false", data: productList });
  } catch (err) {
    console.log(err);
    res.status(400).json({ error: "Some Error" });
  }
};
module.exports = getSellerProducts;
