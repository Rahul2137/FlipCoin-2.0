const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const model = mongoose.model;

const orderSchema = new Schema({
  products: [
    {
      type: Schema.Types.ObjectId,
      ref: "Product",
    },
  ],
  orderTotal: {
    type: String,
  },
  coinsReceived: {
    type: String,
  },
  coinsUsed: {
    type: String,
  },
});

module.exports = model("Order", orderSchema);
