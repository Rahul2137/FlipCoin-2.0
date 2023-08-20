const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const model = mongoose.model;

const customerSchema = new Schema({
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  email: {
    type: String,
    unique: true,
  },
  password: {
    type: String,
  },
  role: {
    type: String,
  },
  cart: [
    {
      sellerId: {
        type: String,
      },
      products: [
        {
          productId: {
            type: String,
          },
          productQt: {
            type: Number,
          },
        },
      ],
    },
  ],
  orders: [
    {
      type: Schema.Types.ObjectId,
      ref: "Order",
    },
  ],
});

module.exports = model("Customer", customerSchema);
