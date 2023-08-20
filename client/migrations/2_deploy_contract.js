const Seller = artifacts.require("Seller");
const FlipCoin = artifacts.require("FlipCoin");
const FlipBank = artifacts.require("FlipBank");

module.exports = async function(deployer) {
  deployer.deploy(FlipCoin);
  deployer.deploy(Seller);
  deployer.deploy(FlipBank);
};