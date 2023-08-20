const Customer = require("../../models/Customer.js");
const Product = require("../../models/Product.js");
const Seller = require("../../models/Seller.js");

const postAddToCart = async (req, res) => {
  try {
    const customerId = req.user.userId;
    const { productId, op } = req.body;
    console.log(req.body);
    const product = await Product.findById(productId).populate("seller");
    const customer = await Customer.findOne({ _id: customerId });
    const sellerId = product.seller._id;
    console.log(sellerId);
    if (!customer) {
      console.log("Customer not found.");
      return;
    }

    // Check if the seller already exists in the cart
    const sellerIndex = customer.cart.findIndex(
      (item) => item.sellerId === sellerId.toString()
    );
    console.log("index", sellerIndex);

    if (sellerIndex !== -1) {
      // Seller exists, now check if the product already exists for this seller
      const productIndex = customer.cart[sellerIndex].products.findIndex(
        (item) => item.productId === productId
      );

      if (productIndex !== -1) {
        // Product already exists, increment productQt by 1
        if (op == "1") {
          customer.cart[sellerIndex].products[productIndex].productQt += 1;
        } else if (
          op == "-1" &&
          customer.cart[sellerIndex].products[productIndex].productQt > 1
        ) {
          customer.cart[sellerIndex].products[productIndex].productQt -= 1;
        } else {
          customer.cart[sellerIndex].products.splice(productIndex, 1);
        }
      } else {
        // Product doesn't exist, create a new product entry with productQt as 1
        customer.cart[sellerIndex].products.push({
          productId: productId,
          productQt: 1,
        });
      }
    } else {
      // Seller doesn't exist, create a new seller entry with the product
      customer.cart.push({
        sellerId: sellerId,
        products: [
          {
            productId: productId,
            productQt: 1,
          },
        ],
      });
    }

    // Save the updated customer document
    await customer.save();
    return res.status(200).json({ error: false });
  } catch (err) {
    console.log(err);
    res.status(400).json({ error: "Some Error" });
  }
};
module.exports = postAddToCart;
