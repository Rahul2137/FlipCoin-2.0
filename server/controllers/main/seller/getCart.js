const Customer = require("../../../models/Customer");
const Product = require("../../../models/Product");

const getCart = async (req, res) => {
  try {
    const customerId = req.user.userId;
    const customer = await Customer.findById(customerId);
    if (!customer) {
      return res.status(404).json({ error: "true", msg: "User Not Found" });
    }
    let response = [];

    const productPromises = [];

    customer.cart.forEach((element) => {
      element.products.forEach((product) => {
        const productPromise = Product.findById(product.productId)
          .then((productDetails) => {
            response.push({
              sellerId: element.sellerId,
              productId: productDetails._id.toString(),
              productQt: product.productQt,
              name: productDetails.name,
              price: productDetails.price,
              imgUrl: productDetails.imgUrl,
            });
          })
          .catch((error) => {
            console.error(error);
          });

        productPromises.push(productPromise);
      });
    });

    // Wait for all promises to resolve before sending the response
    Promise.all(productPromises)
      .then(() => {
        console.log(response);
        return res.status(200).json({ error: false, cartDetails: response });
      })
      .catch((error) => {
        console.error(error);
        return res
          .status(500)
          .json({ error: true, msg: "Internal Server Error" });
      });
  } catch (err) {
    console.log(err);
    res.status(400).json({ error: "Some Error" });
  }
};

module.exports = getCart;
