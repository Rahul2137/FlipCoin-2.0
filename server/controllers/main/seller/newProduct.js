const Product = require("../../../models/Product.js");
const Seller = require("../../../models/Seller.js");

const addNewProduct = async (req, res) => {
  console.log("get all products");
  try {
    const { name, price, imgUrl } = req.body;
    const sellerId = req.user.userId;
    const seller = await Seller.findById(sellerId);
    console.log(seller);
    const product = Product.create({
      seller: seller,
      name,
      price,
      imgUrl,
    });
    return res.status(201).json({ error: false });
  } catch (err) {
    console.log(err);
    return res.status(400).json({ error: "Some Error" });
  }
};

const editProduct = async (req, res) => {
  try {
    const { name, price, imgUrl, productId } = req.body;
    const product = await Product.findByIdAndUpdate(productId, {
      name: name,
      price: price,
      imgUrl: imgUrl,
    });
    res.status(201).json({ error: false });
  } catch (err) {
    console.log(err);
    res.status(400).json({ error: "Some Error" });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { productId } = req.body;
    const product = await Product.findByIdAndDelete(productId);
    return res.status(201).json({ error: false });
  } catch (err) {
    console.log(err);
    res.status(400).json({ error: "Some Error" });
  }
};
module.exports = {
  addNewProduct,
  editProduct,
  deleteProduct,
};
