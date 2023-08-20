pragma solidity ^0.5.0;
pragma experimental ABIEncoderV2;

import "./FlipCoin.sol";
import "./Seller.sol";

contract FlipBank {
  address public owner; 
  string public name = "FlipCoin Exchange";
  FlipCoin public flipcoin;
  Seller public sellers;
  uint public rate = 10**12;
  mapping(string => address) public sellersInfo;

  event CoinsPurchased(
    address account,
    uint amount,
    uint rate
  );

  event CoinsSold(
    address account,
    uint amount,
    uint rate
  );

  modifier onlyBy(address _account) {
      require(
         msg.sender == _account,
         "Sender not authorized."
      );
      _;
   }

  constructor() public {
    owner = msg.sender;
    flipcoin = new FlipCoin();
    sellers = new Seller();
  }

  function mintCoins() public onlyBy(owner) payable returns (bool success){
    flipcoin.mintCoins(msg.value / rate * 100);
    return true;
  }

  function buyFlipCoins() public payable {
    uint flipcoinAmount = msg.value / rate;
    flipcoin.transfer(msg.sender, flipcoinAmount);
    emit CoinsPurchased(msg.sender, msg.value, rate);
  }

  function sellFlipCoins(uint _amount) public {
    require(flipcoin.balanceOf(msg.sender) >= _amount);

    uint etherAmount = _amount * rate / 10;

    require(address(this).balance >= etherAmount);

    flipcoin.transferFrom(msg.sender, address(this), _amount);
    msg.sender.transfer(etherAmount);
    emit CoinsSold(msg.sender, etherAmount, rate);
  }

  function registerSeller(string memory brand, uint _offer_rate, uint _offer_cap, uint _receive_rate, uint _receive_cap) public returns (bool success) {
    require(sellersInfo[brand] == address(0));
    sellersInfo[brand] = msg.sender;
    sellers.listSeller(msg.sender, _offer_rate, _offer_cap, _receive_rate, _receive_cap);
    return true;
  }

  function updateSeller(string memory brand, uint _offer_rate, uint _offer_cap, uint _receive_rate, uint _receive_cap) public returns (bool success) {
    require(sellersInfo[brand] == msg.sender);
    sellers.editSeller(msg.sender, _offer_rate,_offer_cap, _receive_rate, _receive_cap);
    return true;
  }

  function getSellerInfo(string memory brand) public view returns (uint _offer_rate, uint _offer_cap, uint _receive_rate, uint _receive_cap){
    return sellers.getSellerInfo(sellersInfo[brand]);
  }

  function getValue(string memory key) public view returns (address a) {
    return sellersInfo[key];
  }

  function rewardUser(uint _reward, string memory brand) public returns (bool success) {
    require(flipcoin.getBalance(sellersInfo[brand]) >= _reward);
    flipcoin.transferFrom(sellersInfo[brand], msg.sender, _reward);
    return true;
  }

  function redeemCoins(uint _amount, string memory brand) public returns (bool success) {
    require(flipcoin.getBalance(msg.sender) >= _amount);
    flipcoin.transferFrom(msg.sender, sellersInfo[brand], _amount);
    return true;
  }

  function getWalletBalance() public view returns (uint balance){
    return flipcoin.getBalance(msg.sender);
  }

  function getSpendings() public view returns (uint spend) {
    return flipcoin.getSpendings(msg.sender);
  }
}