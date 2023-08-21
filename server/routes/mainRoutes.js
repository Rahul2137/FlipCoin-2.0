const express = require("express");
const router = express.Router();
const getAllProducts = require("../controllers/main/getAllProducts");
const auth = require("../middleware/auth");
const postAddToCart = require("../controllers/main/postAddToCart");
const {
  addNewProduct,
  editProduct,
  deleteProduct,
} = require("../controllers/main/seller/newProduct");
const editLoyaltyProgram = require("../controllers/main/seller/editLoyaltyProgram");
const getCart = require("../controllers/main/seller/getCart");
const getSellerProducts = require("../controllers/main/getSellerProducts");
const deleteCart = require("../controllers/main/deleteCart");

router.get("/getAllProducts", auth, getAllProducts);
router.get("/getSellerProducts", auth, getSellerProducts);
router.get("/getCart", auth, getCart);
router.post("/addToCart", auth, postAddToCart);
router.post("/addNewProduct", auth, addNewProduct);
router.post("/editProduct", auth, editProduct);
router.post("/deleteProduct", auth, deleteProduct);
router.post("/availLoyaltyProgram", auth, editLoyaltyProgram);
router.post("/deleteCart", auth, deleteCart);

module.exports = router;
