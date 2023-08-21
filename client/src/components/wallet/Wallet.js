import { Box, Grid } from "@mui/material";
import React, { useEffect, useState } from "react";
import WalletBox from "./WalletBox";
import WalletHistory from "./WalletHistory";
import { useContract } from "../ContractContext";
import { useSelector } from "react-redux";

function isEmpty(obj) {
  return Object.keys(obj).length === 0;
}

const temp = [
  {
    transaction: 0,
    otherParty: "0x1239821255478952",
    amount: 500,
    timestamp: "2017-05-06",
  },
  {
    transaction: 1,
    otherParty: "0x1239921255145623",
    amount: 100,
    timestamp: "2017-05-06",
  },
  {
    transaction: 1,
    otherParty: "0x1239921355789651",
    amount: 50,
    timestamp: "2017-05-06",
  },
  {
    transaction: 0,
    otherParty: "0x1239825555453214",
    amount: 900,
    timestamp: "2017-05-06",
  },
];

const Wallet = () => {
  const info = useSelector((state) => state.contract);
  const user = useSelector((state) => state.user);
  let flipBank = info?.contractDetails.flipBank;
  let flipCoin = info?.contractDetails.flipCoin;
  let accounts = info?.contractDetails.accounts;
  const [coinBalance, setCoinBalance] = useState("Fetching...");
  const [spending, setSpending] = useState("Fetching...");
  const [transactions, setTransactions] = useState("Fetching");
  useEffect(() => {
    if (!isEmpty(flipBank)) {
      flipBank
        ?.getWalletBalance()
        .call({ from: accounts[0] })
        .then((b) => {
          setCoinBalance(b);
        })
        .catch((error) => console.error("Error getting Balance:", error));

      flipBank
        ?.getSpendings()
        .call({ from: accounts[0] })
        .then((b) => {
          setSpending(b);
        })
        .catch((error) => console.error("Error getting Coins Spend:", error));
    }
    if (!isEmpty(flipCoin)) {
      flipCoin
        ?.getTransactions()
        .call()
        .then((b) => {
          setTransactions(b);
          console.log(b);
        })
        .catch((error) => console.error("Error getting Transactions:", error));
    }
    console.log(transactions);
  }, [flipBank, flipCoin]);
  return (
    <Box sx={{ width: "100%", height: "100vh", display: "flex" }}>
      <Grid container>
        <Grid item md={4} sm={12}>
          <WalletBox balance={coinBalance} spending={spending} />
        </Grid>
        <Grid
          item
          md={8}
          sm={12}
          sx={{
            display: user?.userDetails?.role === "seller" ? "block" : "none",
            background:
              "radial-gradient(circle at 6.6% 12%, rgb(64, 0, 126) 20.8%, rgb(0, 255, 160) 100.2%)",
          }}
        >
          <WalletHistory data={temp} />
        </Grid>
      </Grid>
          
    </Box>
  );
};

export default Wallet;
