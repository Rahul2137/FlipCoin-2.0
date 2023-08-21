import { Box, Grid, Button, Paper } from "@mui/material";
import React, { useEffect, useState } from "react";
import CartCard from "./CartCard";
import HomeNavbar from "../home/HomeNavbar";
import { useNavigate } from "react-router-dom";
import { connect, useSelector } from "react-redux";
import { getMainActions } from "../../app/actions/mainActions";

function isEmpty(obj) {
  return Object.keys(obj).length === 0;
}

const Cart = ({ getCart }) => {
  const userinfo = useSelector((state) => state.user);
  const info = useSelector((state) => state.contract);
  let flipBank = info?.contractDetails.flipBank;
  let accounts = info?.contractDetails.accounts;
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [balance, setBalance] = useState("");
  const [payCoins, setPayCoins] = useState("");
  const [toPay, setToPayCoins] = useState("");
  const [getCoins, setGetCoins] = useState("");

  const getCartDetails = async () => {
    const cartDetails = await getCart();
    let itemDetails = [];
    // Create an array to store all the promises
    let promises = [];
    console.log("cartDetailsInside", cartDetails);
    cartDetails.forEach((element) => {
      const sellerId = element.sellerId;

      if (!isEmpty(flipBank)) {
        const promise = flipBank
          .getSellerInfo(sellerId)
          .call({ from: accounts[0] })
          .then((b) => {
            itemDetails.push({
              ...element,
              offerRate: b._offer_rate,
              offerCap: b._offer_cap,
              receiveRate: b._receive_rate,
              receiveCap: b._receive_cap,
            });
          })
          .catch((error) => console.error("Error getting Seller Data:", error));

        promises.push(promise);
      }
    });

    // Wait for all promises to resolve
    Promise.all(promises)
      .then(() => {
        // All promises have resolved, and itemDetails has been populated
        console.log("hi", itemDetails);
      })
      .catch((error) => console.error("Error:", error));

    itemDetails.sort(function (x, y) {
      if (x.receiveRate < y.receiveRate) {
        return -1;
      }
      if (x.receiveRate > y.receiveRate) {
        return 1;
      }
      return 0;
    });
    if (!isEmpty(flipBank)) {
      flipBank
        .getWalletBalance()
        .call({ from: accounts[0] })
        .then((b) => {
          setBalance(b);
        })
        .catch((error) => console.error("Error getting Balance:", error));
    }
    setItems(itemDetails);
    const toPay = {};

    function addToJSON(key, number) {
      if (toPay.hasOwnProperty(key)) {
        toPay[key] += number;
      } else {
        toPay[key] = number;
      }
    }

    let mybalance = balance;
    let totalcoin = 0;
    itemDetails.forEach((product) => {
      if (
        mybalance === 0 ||
        product.receiveCap === 0 ||
        product.receiveRate == 0
      ) {
        return;
      }
      let to_pay = Math.min(
        product.receiveCap,
        mybalance,
        Math.floor((product.price * product.productQt) / product.receiveRate)
      );
      if (to_pay === 0) {
        return;
      }
      mybalance -= to_pay;
      totalcoin += to_pay * product.receiveRate;
      addToJSON(product.sellerId, to_pay);
    });
    setPayCoins(toPay);
    setToPayCoins(totalcoin);

    const toGet = {};

    function addToget(key, number) {
      if (toGet.hasOwnProperty(key)) {
        toGet[key] += number;
      } else {
        toGet[key] = number;
      }
    }

    itemDetails.forEach((product) => {
      let offeredCoins = Math.min(
        Math.floor(
          (product.price / 100) * product.offerRate * product.productQt
        ),
        product.offerCap
      );
      if (offeredCoins > 0) {
        addToget(product.sellerId, offeredCoins);
      }
    });
    setGetCoins(toGet);
  };
  useEffect(() => {
    getCartDetails();
  }, []);

  const changeCount = (id, type) => {
    const updatedItems = items.map((item) => {
      if (item.productId === id) {
        if (type === "decrease" && item.productQt - 1 === 0) return null;
        return {
          ...item,
          productQt:
            type === "decrease" ? item.productQt - 1 : item.productQt + 1,
        };
      }
      return item;
    });
    const filteredItems = updatedItems.filter((item) => item !== null);
    setItems(filteredItems);
  };
  const removeItem = (id) => {
    setItems(items.filter((item) => item.id !== id));
  };
  const handlePay = () => {
    if (toPay !== 0) {
      for (const key in payCoins) {
        if (payCoins.hasOwnProperty(key)) {
          const value = payCoins[key];
          if (!isEmpty(flipBank)) {
            flipBank
              .redeemCoins(value, key)
              .send({ from: accounts[0] })
              .then((b) => {
                console.log("Coins redeemed to ", key);
              })
              .catch((error) => console.error("Error getting Balance:", error));
          }
        }
      }
    }
    for (const key in getCoins) {
      if (getCoins.hasOwnProperty(key)) {
        const value = getCoins[key];
        if (!isEmpty(flipBank)) {
          flipBank
            .rewardUser(value, key)
            .send({ from: accounts[0] })
            .then((b) => {
              console.log("Coins Awarded from ", key);
            })
            .catch((error) => console.error("Error getting Balance:", error));
        }
      }
    }
    setGetCoins([]);
    setPayCoins([]);
    setItems([]);
  };
  return (
    <div>
      <HomeNavbar />
      <Box sx={{ width: "100%", height: "100vh", display: "flex", mt: 9 }}>
        <Grid container>
          <Grid item sx={12} lg={8}>
            <Box sx={{ fontFamily: "Arial, Helvetica, sans-serif" }}>
              <h2 style={{ color: "#081b8c", marginLeft: "25px" }}>
                Your Cart
              </h2>
              <h3
                style={{
                  display: items.length !== 0 ? "none" : "flex",
                  justifyContent: "center",
                }}
              >
                Cart is empty!
              </h3>
              {items.map((item, i) => (
                <Paper
                  elevation={2}
                  style={{ padding: "10px 30px", margin: "5px 20px" }}
                >
                  <CartCard
                    item={item}
                    changeCount={changeCount}
                    removeItem={removeItem}
                  />
                </Paper>
              ))}
            </Box>
          </Grid>
          <Grid item sx={12} lg={4}>
            <Paper elevation={3} style={{ margin: "66px 20px" }}>
              <Box
                sx={{
                  padding: "10px 20px",
                  fontFamily: "Arial, Helvetica, sans-serif",
                }}
              >
                <h2 style={{ color: "#081b8c" }}>Order Details</h2>
                <table style={{ width: "100%" }}>
                  <tr style={{ fontSize: "1.3em" }}>
                    <td align="center" style={{ padding: "10px 0" }}>
                      Total Amount:
                    </td>
                    <td align="center">
                      {items.reduce(
                        (total, item) => total + item.price * item.productQt,
                        0
                      )}
                    </td>
                  </tr>
                  <tr style={{ fontSize: "1.3em" }}>
                    <td align="center" style={{ padding: "10px 0" }}>
                      Total Tokens:
                    </td>
                    <td align="center">
                      {items.reduce(
                        (total, item) =>
                          total +
                          Math.min(
                            Math.floor(
                              (item.price / 100) *
                                item.offerRate *
                                item.productQt
                            ),
                            item.offerCap
                          ),
                        0
                      )}
                    </td>
                  </tr>
                  <tr style={{ fontSize: "1.3em" }}>
                    <td align="center" style={{ padding: "10px 0" }}>
                      Token Reduction:
                    </td>
                    <td align="center">{toPay}</td>
                  </tr>
                  <tr style={{ fontSize: "1.3em" }}>
                    <td align="center" style={{ padding: "10px 0" }}>
                      Amount Payable:
                    </td>
                    <td align="center">
                      {items.reduce(
                        (total, item) => total + item.price * item.productQt,
                        0
                      ) - toPay}
                    </td>
                  </tr>
                  <tr style={{ fontSize: "1.3em" }}>
                    <td align="center" style={{ padding: "10px 0" }}>
                      <Button
                        onClick={() => navigate("/")}
                        variant="outlined"
                        color="success"
                      >
                        Back
                      </Button>
                    </td>
                    <td align="center">
                      <Button variant="outlined" onClick={handlePay}>
                        Pay Now
                      </Button>
                    </td>
                  </tr>
                </table>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </div>
  );
};

const mapActionsToProps = (dispatch) => {
  return {
    ...getMainActions(dispatch),
  };
};
export default connect(null, mapActionsToProps)(Cart);
