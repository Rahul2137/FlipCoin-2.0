import React, { useEffect, useState } from "react";
import HomeNavbar from "./HomeNavbar";
import OutfitCard from "./OutfitCard";
import PropTypes from 'prop-types';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { Box, Button, Dialog, DialogTitle, Typography, DialogContent, DialogActions, TextField, Grid, Tooltip, Paper } from "@mui/material";
import { styled } from '@mui/material/styles';
import { getMainActions } from "../../app/actions/mainActions";
import { connect, useSelector } from "react-redux";
import { logout } from "../../shared/utils/logout";
import { getAuthActions } from "../../app/actions/authActions";
import { useNavigate } from "react-router-dom";
import web3Reducer from "../../shared/components/web3Reducer";
import Web3 from 'web3';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

function BootstrapDialogTitle(props) {
  const { children, onClose, ...other } = props;
  
  // const [coinBalance, setCoinBalance] = useState("Fetching...");
  // const [spending, setSpending] = useState("Fetching...");
  // const [transactions, setTransactions] = useState("Fetching"); 

  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
}

BootstrapDialogTitle.propTypes = {
  children: PropTypes.node,
  onClose: PropTypes.func.isRequired,
};

const HomePage = ({
  getAllProducts,
  addNewProduct,
  getSellerProducts,
  availLoyaltyProgram,
}) => {
  const navigate = useNavigate();
  const productList = useSelector((state) => state.main.productList);
  const [user, setUser] = useState({});
  const [open, setOpen] = useState(false);
  const [openProduct, setOpenProduct] = useState(false);
  const [openBuy, setOpenBuy] = useState(false);
  const [buyValue, setBuyValue] = useState(null);
  const [sellValue, setSellValue] = useState(null);
  const [etherValue, setEtherValue] = useState(null);
  const [productName, setProductName] = useState("");
  const [productPrice, setProductPrice] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  const info = useSelector((state) => state.contract);
  let flipBank = info?.contractDetails.flipBank;
  let flipCoin = info?.contractDetails.flipCoin;
  let accounts = info?.contractDetails.accounts

  const web3 = window.web3;

  const [formdata, setformdata] = useState({
    name: "",
    price: "",
    photo: "",
  });
  const [loyaltyData, setLoyaltyData] = useState({
    offerRate: "",
    offerCap: "",
    recieveRate: "",
    recieveCap: "",
  });

  function isEmpty(obj) {
    return Object.keys(obj).length === 0;
  }

  const handleBuyClick = async () => {
    if(!isEmpty(flipBank)){
      await flipBank?.buyFlipCoins().send({from: accounts[0], value: web3.utils.toWei(etherValue, 'ether')})
      .then(b => {console.log("Buy Transaction successful")})
      .catch(error => console.error('Error in the buy Coin Transaction:', error));
    }
    handleCloseBuy();
  }

  const handleSellClick = async () => {
    if(!isEmpty(flipBank)){
      await flipBank?.sellFlipCoins(sellValue).send({from: accounts[0]})
      .then(b => {console.log("Sell Transaction successful")})
      .catch(error => console.error('Error in sell coin transaction:', error));
    }
    handleCloseBuy();
  }

  const handleCloseBuy = () => {
    setOpenBuy(false);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
  };

  const clearFileSelection = () => {
    setSelectedFile(null);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = (event, reason) => {
    if (reason && reason === "backdropClick") return;
    setOpen(false);
  };
  const handleProductClickOpen = () => {
    setOpenProduct(true);
  };
  const handleProductClose = (event, reason) => {
    if (reason && reason === "backdropClick") return;
    setOpenProduct(false);
  };

  const handleLoyaltySubmit = async () => {
    if(!isEmpty(flipBank)){
      await flipBank?.registerSeller(user.userId,loyaltyData.offerRate, loyaltyData.offerCap, loyaltyData.recieveRate, loyaltyData.recieveCap).send({from: accounts[0]})
      .then(b => {console.log("Seller Registered")})
      .catch(error => console.error('Error in Registering Seller:', error));
    }

    availLoyaltyProgram();
    setLoyaltyData({
      offerRate: "",
      offerCap: "",
      recieveCap: "",
      offerRate: "",
    });

    setOpen(false);
  };

  const uploadImage = async () => {
    const data = new FormData();
    data.append("file", selectedFile);
    data.append("upload_preset", "flipcoin_preset");
    data.append("cloud_name", "harshit9829");
    await fetch("https://api.cloudinary.com/v1_1/harshit9829/image/upload", {
      method: "post",
      body: data,
    })
      .then((resp) => resp.json())
      .then((data) => {
        setformdata({ ...formdata, photo: data.url });
      })
      .catch((err) => console.log(err));
  };

  function handleAddProduct(e) {
    e.preventDefault();
    uploadImage();
  }

  useEffect(() => {
    if (formdata.photo !== "") {
      const data = {
        imgUrl: formdata.photo,
        name: formdata.name,
        price: formdata.price,
      };
      addNewProduct(data);
      setOpenProduct(false);
      setProductName("");
      setProductPrice(null);
      setSelectedFile(null);
    }
  }, [formdata.photo]);

  // console.log(useSelector((state) => state.main.productList))
  const [outfitList, setOutfitList] = useState([]);

  useEffect(() => {
    const userDetails = JSON.parse(localStorage.getItem("user"));
    if (!userDetails) {
      logout();
    }
    setUser(userDetails);
    if (userDetails.role === "seller") {
      getSellerProducts();
    } else {
      getAllProducts();
    }
    setOutfitList(productList);
  }, []);

  return (
    <>
      <HomeNavbar />
      <Box
        sx={{
          mt: 10,
          width: "100%",
          display: user && user.role === "seller" ? "flex" : "none",
          justifyContent: "center",
        }}
      >
        <Button
          variant="contained"
          color="success"
          sx={{ mr: 5 }}
          onClick={() => setOpenBuy(true)}
        >
          Buy / Sell Coins
        </Button>
        <BootstrapDialog
          onClose={handleCloseBuy}
          aria-labelledby="customized-dialog-title"
          open={openBuy}
        >
          <BootstrapDialogTitle
            id="customized-dialog-title"
            onClose={handleCloseBuy}
          >
            Buy / Sell Coins
          </BootstrapDialogTitle>
          <DialogContent dividers>
            <Grid container>
              <Grid item sx={{ mr: 2 }}>
                <Paper elevation={2} sx={{padding: "20px"}}>
                  <Typography variant="body1" sx={{ mb: 2 }}>Current Exchange rate is: 1000000</Typography>
                  <TextField id="outlined-basic" disabled={sellValue} sx={{ mb: 2 }} value={buyValue} onChange={(e) => { setBuyValue(e.target.value); setEtherValue(e.target.value / 1000000); }} label={etherValue ? "" : "Number of Coins"} variant="outlined" /><br />
                  <TextField id="outlined-basic" disabled={sellValue} value={etherValue} onChange={(e) => { setEtherValue(e.target.value); setBuyValue(e.target.value * 100000) }} label={buyValue ? "" : "Number of ethers"} variant="outlined" />
                  <Typography variant="body1" sx={{ mt: 2 }}>Total Payable amount: {etherValue}</Typography>
                  <div style={{ display: "flex", justifyContent: "center", marginTop: "10px" }}><Button autoFocus variant="contained" onClick={handleBuyClick}>
                    Buy
                  </Button></div>
                </Paper>
              </Grid>
              <Grid item sx={{ mr: 2 }}>
                <Paper elevation={2} sx={{padding: "20px"}}>
                  <Typography variant="body1" sx={{ mb: 2 }}>Current Selling rate is: 1000000</Typography>
                  <TextField id="outlined-basic" disabled={buyValue} value={sellValue} onChange={(e) => setSellValue(e.target.value)} label="Number of Coins" variant="outlined" />
                  <Typography variant="body1" sx={{ mt: 2 }}>Total value: {sellValue / 1000000}</Typography>
                  <div style={{ display: "flex", justifyContent: "center", marginTop: "10px" }}><Button autoFocus variant="contained" onClick={handleSellClick}>
                    Sell
                  </Button></div>
                </Paper>
              </Grid>
            </Grid>
          </DialogContent>
        </BootstrapDialog>
        <Button
          variant="contained"
          color="success"
          sx={{ mr: 5 }}
          onClick={handleClickOpen}
        >
          Avail Loalty Program
        </Button>
        <BootstrapDialog
          onClose={handleClose}
          aria-labelledby="customized-dialog-title"
          open={open}
        >
          <BootstrapDialogTitle
            id="customized-dialog-title"
            onClose={handleClose}
          >
            Enroll in Loyalty Program
          </BootstrapDialogTitle>
          <DialogContent dividers>
            <Grid container sx={{ mb: 2 }}>
              <Grid item>
                <Tooltip
                  title="Coins recieved by user on per Rs.100 purchase"
                  placement="top-start"
                >
                  <TextField
                    id="outlined-basic"
                    value={loyaltyData.offerRate}
                    onChange={(e) =>
                      setLoyaltyData({
                        ...loyaltyData,
                        offerRate: e.target.value,
                      })
                    }
                    sx={{ mr: 5 }}
                    label="Offer Rate"
                    variant="outlined"
                  />
                </Tooltip>
              </Grid>
              <Grid item>
                <Tooltip
                  title="Max. coins rewarded per order"
                  placement="top-start"
                >
                  <TextField
                    id="outlined-basic"
                    value={loyaltyData.offerCap}
                    onChange={(e) =>
                      setLoyaltyData({
                        ...loyaltyData,
                        offerCap: e.target.value,
                      })
                    }
                    label="Offer Cap"
                    variant="outlined"
                  />
                </Tooltip>
              </Grid>
            </Grid>
            <Grid container>
              <Grid item>
                <Tooltip
                  title="coin value on redemption"
                  placement="bottom-end"
                >
                  <TextField
                    id="outlined-basic"
                    value={loyaltyData.recieveRate}
                    onChange={(e) =>
                      setLoyaltyData({
                        ...loyaltyData,
                        recieveRate: e.target.value,
                      })
                    }
                    sx={{ mr: 5 }}
                    label="Recieve Rate"
                    variant="outlined"
                  />
                </Tooltip>
              </Grid>
              <Grid item>
                <Tooltip
                  title="max. coin value on redemption"
                  placement="bottom-end"
                >
                  <TextField
                    id="outlined-basic"
                    value={loyaltyData.recieveCap}
                    onChange={(e) =>
                      setLoyaltyData({
                        ...loyaltyData,
                        recieveCap: e.target.value,
                      })
                    }
                    label="Recieve Cap"
                    variant="outlined"
                  />
                </Tooltip>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button autoFocus onClick={handleLoyaltySubmit}>
              Submit
            </Button>
          </DialogActions>
        </BootstrapDialog>
        <Button
          variant="outlined"
          color="success"
          onClick={handleProductClickOpen}
          sx={{ ml: 4 }}
        >
          Add Product
        </Button>
        <BootstrapDialog
          onClose={handleProductClose}
          aria-labelledby="customized-dialog-title"
          open={openProduct}
        >
          <BootstrapDialogTitle
            id="customized-dialog-title"
            onClose={handleProductClose}
          >
            Register a product
          </BootstrapDialogTitle>
          <DialogContent dividers>
            <Grid container sx={{ mb: 2 }}>
              <Grid item>
                <input
                  type="file"
                  id="file-input"
                  accept=".jpg, .jpeg, .png"
                  style={{ display: "none" }}
                  onChange={handleFileChange}
                />
                <label htmlFor="file-input">
                  <Button
                    component="span"
                    variant="outlined"
                    sx={{ mr: 2 }}
                    color="primary"
                  >
                    Select File
                  </Button>
                </label>
                {selectedFile && (
                  <Typography variant="body1" display="inline">
                    {selectedFile.name}
                    <IconButton
                      size="small"
                      aria-label="Clear selection"
                      onClick={clearFileSelection}
                    >
                      <CloseIcon />
                    </IconButton>
                  </Typography>
                )}
                {!selectedFile && (
                  <Typography
                    variant="body1"
                    color="textSecondary"
                    display="inline"
                  >
                    No file selected
                  </Typography>
                )}
              </Grid>
            </Grid>
            <Grid container>
              <Grid item>
                <TextField
                  id="outlined-basic"
                  required
                  value={formdata.name}
                  onChange={(e) =>
                    setformdata({ ...formdata, name: e.target.value })
                  }
                  sx={{ mr: 5 }}
                  label="Name"
                  variant="outlined"
                />
              </Grid>
              <Grid item>
                <TextField
                  id="outlined-basic"
                  required
                  value={formdata.price}
                  onChange={(e) =>
                    setformdata({ ...formdata, price: e.target.value })
                  }
                  label="Price"
                  variant="outlined"
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button
              disabled={!selectedFile || !formdata.name || !formdata.price}
              autoFocus
              onClick={handleAddProduct}
            >
              Add
            </Button>
          </DialogActions>
        </BootstrapDialog>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          mt: user && user.role === "seller" ? 0 : 9,
        }}
      >
        <Box sx={{ width: "100%" }}>
          {outfitList ? <OutfitCard outfitDetails={outfitList} /> : <></>}
        </Box>
      </Box>
    </>
  );
};

const mapActionsToProps = (dispatch) => {
  return {
    ...getMainActions(dispatch),
  };
};
export default connect(null, mapActionsToProps)(HomePage);
