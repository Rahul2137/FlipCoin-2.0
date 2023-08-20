const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const model = mongoose.model;

const productSchema = new Schema({
  seller: {
    type: Schema.Types.ObjectId,
    ref: "Seller",
  },
  imgUrl: {
    type: String,
  },
  name: {
    type: String,
  },
  price: {
    type: String,
  },
});

module.exports = model("Product", productSchema);
