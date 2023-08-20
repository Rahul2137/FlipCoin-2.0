import { Box } from "@mui/material";
import React, { useEffect, useState } from "react";
import WalletBox from "./WalletBox";
import WalletHistory from "./WalletHistory";
import { useContract } from "../ContractContext";
import { useSelector } from "react-redux";

function isEmpty(obj) {
  return Object.keys(obj).length === 0;
}

const Wallet = () => {
  const info = useSelector((state) => state.contract);
  let flipBank = info?.contractDetails.flipBank;
  let flipCoin = info?.contractDetails.flipCoin;
  let accounts = info?.contractDetails.accounts
  const [coinBalance, setCoinBalance] = useState("Fetching...");
  const [spending, setSpending] = useState("Fetching...");
  const [transactions, setTransactions] = useState("Fetching");
  useEffect(() => {
    if(!isEmpty(flipBank)){
      flipBank?.getWalletBalance().call({from: accounts[0]})
      .then(b => {setCoinBalance(b)})
      .catch(error => console.error('Error getting Balance:', error));

      flipBank?.getSpendings().call({from: accounts[0]})
      .then(b => {setSpending(b)})
      .catch(error => console.error('Error getting Coins Spend:', error));
    }
    if(!isEmpty(flipCoin)){
      flipCoin?.getTransactions().call()
      .then(b => {setTransactions(b); console.log(b)})
      .catch(error => console.error('Error getting Transactions:', error));
    }
    console.log(transactions);
  }, [flipBank, flipCoin]);
  return (
    <Box sx={{ width: "100%", height: "100vh", display: "flex" }}>
      <WalletBox balance={coinBalance} spending={spending} />
      <WalletHistory />
    </Box>
  );
};

export default Wallet;
