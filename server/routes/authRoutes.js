const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const postLogin = require("../controllers/auth/customer/postLogin");
const postRegister = require("../controllers/auth/customer/postRegister");
const sellerRegister = require("../controllers/auth/seller/sellerRegister");
const sellerLogin = require("../controllers/auth/seller/sellerLogin");

router.post("/register", postRegister);
router.post("/login", postLogin);
router.post("/seller/login", sellerLogin);
router.post("/seller/register", sellerRegister);
router.get("/test", auth, (req, res) => {
  res.send("request passed");
});

module.exports = router;
