const Product = require("../../models/Product.js");

const getAllProducts = async (req, res) => {
  console.log("get all products");
  try {
    const products = await Product.find();

    res.status(200).json({ error: false, data: products });
  } catch (err) {
    console.log(err);
    res.status(400).json({ error: "Some Error" });
  }
};
module.exports = getAllProducts;
