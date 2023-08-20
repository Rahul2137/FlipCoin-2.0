pragma solidity ^0.5.0;

contract Seller {
    string  public name = "Seller";
    string  public symbol = "SellersList";

    struct SellerInfo{
        uint offer_rate;
        uint offer_cap;
        uint receive_rate;
        uint receive_cap;
    }

    mapping(address => SellerInfo) public sellersList;
    mapping(address => bool) public isRegistered;

    event SellerRegistered(
        address _sellerAddress,
        uint _offer_rate,
        uint _offer_cap,
        uint _receive_rate,
        uint _receive_cap
    );

    event SellerUpdated(
        address _sellerAddress,
        uint _offer_rate,
        uint _offer_cap,
        uint _receive_rate,
        uint _receive_cap
    );

    constructor() public {
    }

    function listSeller(address _brand, uint _offer_rate,uint _offer_cap, uint _receive_rate, uint _receive_cap) public returns (bool success) {
        sellersList[_brand] = SellerInfo(_offer_rate,_offer_cap, _receive_rate, _receive_cap);
        isRegistered[_brand] = true;
        emit SellerRegistered(_brand, _offer_rate,_offer_cap, _receive_rate, _receive_cap);
        return true;
    }

    function editSeller(address _brand, uint _offer_rate, uint _offer_cap, uint _receive_rate, uint _receive_cap) public returns (bool success) {
        if(isRegistered[_brand] == true){
            sellersList[_brand].offer_rate = _offer_rate;
            sellersList[_brand].receive_rate = _receive_rate;
            sellersList[_brand].receive_cap = _receive_cap;
            sellersList[_brand].offer_cap = _offer_cap;
            emit SellerUpdated(_brand, _offer_rate, _offer_cap, _receive_rate, _receive_cap);
            return true;
        }
        return false;
    }

    function getSellerInfo(address _brand) public view returns (uint _offer_rate,uint _offer_cap, uint _receive_rate, uint _receive_cap) {
        require(isRegistered[_brand] == true);
        return (sellersList[_brand].offer_rate, sellersList[_brand].offer_cap, sellersList[_brand].receive_rate, sellersList[_brand].receive_cap);
    }
}